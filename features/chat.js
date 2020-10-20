/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const fr = require("../utils/format_responses.js");
const express = require("express");
const path = require("path");
const store = require("../utils/store");
const resume = require("../resume.json");
const titleize = require("titleize");

const resumeScan = (section, name, userStore) => {
  return section.map((entry) => ({
    title: entry[name],
    payload: entry[name],
    visited: userStore.isVisited(entry[name])
  }));
};

module.exports = function (controller) {
  // make public/index.html available as localhost/index.html
  // by making the /public folder a static/public asset
  controller.publicFolder("/", path.join(__dirname, "..", "dist"));
  // controller.publicFolder("/", path.join(__dirname, "..", "public"));

  console.log("Chat with me: http://localhost:" + (process.env.PORT || 3000));

  controller.hears(
    "home",
    "message,direct_message",
    async (bot, message) => {
      const sections = Object.keys(resume).filter(key => key === "basics" || (resume[key] && resume[key].length))
      // const json = json.parse(resume);

      sections.push("back")

      const quick_replies = sections
        // .filter((sec) => store.includes(sec))
        .map((sec) => ({
          title: titleize(sec),
          payload: titleize(sec),
        }));
      await bot.reply(message, {
        text: `Welcome back to ${resume.basics.name}'s interactive resume! 
        Here are your options!`,
        quick_replies,

      });
    }
  );
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
    if (!resume.hasOwnProperty(catName) || !resume[catName].length) {
      // make an unavailable message and return

    }

    // make responses for each category name
    controller.hears(catName, "message, direct_message", async(bot, message) => {
      const userStore = store.getUserStore(message.user)
      
      const quick_replies = resumeScan(resume[catName], title, userStore)
      userStore.visit(catName)
      
      const catText = fr.formatCategoryText(catName)
      // if (quick_replies === false), make an "unavailable" response here
      await bot.reply(message, {
        text: catText,
        quick_replies
      })
    })
    
    // make responses for each listing in each category
    if (!resume[catName].length) continue
    for (let j = 0; j < resume[catName].length; j++) {
      const entry = resume[catName][j]
      const nodeText = fr.formatEndNode(catName, entry)

      controller.hears(entry[title], "message, direct_message", async (bot, message) => {
        const userStore = store.getUserStore(message.user)
        userStore.visit(entry[title])

        console.log(userStore.history)

        await bot.reply(message, {
          text: nodeText,
          entry
        })
      })
    }
  }

  // Make a conversation
  // Add the different pieces
  // Tell the bot once they click on the company name to begin the dialog

  // controller.on("message,direct_message", async (bot, message) => {
  //   await bot.reply(message, { text: "COOL, YO", something: "thing" });
  // });
};



