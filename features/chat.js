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
  const companies = resumeScan(resume.work, "company");
  companies.push({ title: "Back", payload: "back" });
  controller.hears(
    "work",
    "message,direct_message",
    async (bot, message) => {
      
      const quick_replies = companies
      // console.log(quick_replies)
      await bot.reply(message, {
        text: `Which company do you want to know about?`,
        quick_replies,
      });
    }
  );

  for (let i=0;i<resume.work.length;i++){
    controller.hears(resume.work[i].company, "message, direct_message", async(bot, message) => {
      const quick_replies = Object.keys(resume.work[i]).map(key => ({title: key, payload: key}))
      // console.log(quick_replies)
      await bot.reply(message, {
        text: `Here is a little bit about ${resume.basics.name}'s time at ${resume.work[i].company}.`,
        quick_replies
      })
    })
  }

  controller.on("message,direct_message", async (bot, message) => {
    await bot.reply(message, {text: "COOL, YO", something: "thing"});
  });
};


// Education

