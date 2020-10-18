/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require("express");
const path = require("path");
const resume = require("../resume.json");
const titleize = require("titleize");
const resumeScan = (section, name) => {
  if (!section.length) return false
  return section.map(entry => ({title: entry[name], payload: entry[name]}))
}

module.exports = function (controller) {
  // make public/index.html available as localhost/index.html
  // by making the /public folder a static/public asset
  // controller.publicFolder("/", path.join(__dirname, "..", "dist"));
  controller.publicFolder("/", path.join(__dirname, "..", "public"));

  console.log("Chat with me: http://localhost:" + (process.env.PORT || 3000));
  controller.hears(
    "home",
    "message,direct_message",
    async (bot, message) => {
      const sections = Object.keys(resume).filter(key => key === "basics" || (resume[key] && resume[key].length))
      sections.push("back")
      const quick_replies = sections.map(sec => ({
        title: titleize(sec),
        payload: titleize(sec)
      }))
      await bot.reply(message, {
        text: `Welcome back to ${resume.basics.name}'s interactive resume! 
        Here are your options!`,
        quick_replies,
      });
    }
  );

  // const companies = resumeScan(resume.work, "company");
  // companies.push({ title: "Back", payload: "back" });
  // controller.hears(
  //   "work",
  //   "message,direct_message",
  //   async (bot, message) => {
      
  //     const quick_replies = companies
  //     // console.log(quick_replies)
  //     await bot.reply(message, {
  //       text: `Which company do you want to know about?`,
  //       quick_replies,
  //     });
  //   }
  // );
  categories = [
    ["work", "company"],
    ["volunteer", "organization"],
    ["education", "institution"],
    ["awards", "title"],
    ["publications", "name"],
    ["skills", "name"],
    ["languages", "language"],
    ["interests", "name"],
    ["references", "name"]
  ];

  for (let i=0;i<Object.keys(resume).length-1;i++){
    const [catName, title] = categories[i]

    // make responses for each category name
    controller.hears(catName, "message, direct_message", async(bot, message) => {
      const quick_replies = resumeScan(resume[catName], title)
      // const quick_replies = Object.keys(resume.work).map(key => ({title: key[], payload: key}))
      console.log(quick_replies)
      // if (quick_replies === false), make an "unavailable" response here
      await bot.reply(message, {
        text: catName,
        quick_replies
      })
    })

    // make responses for each listing in each category
    if (!resume[catName].length) continue
    for (let j = 0; j < resume[catName].length; j++) {
      const entry = resume[catName][j]
      controller.hears(entry[title], "message, direct_message", async (bot, message) => {
        await bot.reply(message, {
          text: entry[title],
          entry
        })
      })
    }
  }


  // Maybe we can use this loop for skills,publications, references, interests or whatever
  // for (let i=0;i<resume.work.length;i++){
  //   controller.hears(resume.work[i].company, "message, direct_message", async(bot, message) => {
  //     const quick_replies = Object.keys(resume.work[i]).map(key => ({title: key, payload: key}))
  //     // console.log(quick_replies)
  //     await bot.reply(message, {
  //       text: `Here is a little bit about ${resume.basics.name}'s time at ${resume.work[i].company}.`,
  //       quick_replies
  //     })
  //   })
  // }

  // Make a conversation
  // Add the different pieces
  // Tell the bot once they click on the company name to begin the dialog
  for (let i=0;i<resume.languages[i].length;i++){
    controller.hears(resume.languages[i].language, "message, direct_message", async(bot, message) => {
      const quick_replies = Object.keys(resume.language[i]).map(key => ({title: key, payload: key}))
      // console.log(quick_replies)
      await bot.reply(message, {
        text: `Here are the languages that ${resume.basics.name} knows.`,
        quick_replies
      })
    })
  }

  

  controller.on("message,direct_message", async (bot, message) => {
    await bot.reply(message, {text: "COOL, YO", something: "thing"});
  });
};




