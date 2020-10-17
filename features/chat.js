/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require("express");
const path = require("path");
const resume = require("../resume.json");

const resumeScan = section => {
  
  
}

module.exports = function (controller) {
  // make public/index.html available as localhost/index.html
  // by making the /public folder a static/public asset
  // controller.publicFolder("/", path.join(__dirname, "..", "dist"));
  controller.publicFolder("/", path.join(__dirname, "..", "public"));

  console.log("Chat with me: http://localhost:" + (process.env.PORT || 3000));
  const sections = Object.keys(resume).filter(key => key === "basics" || (resume[key] && resume[key].length))
  sections.push("back")
  const quick_replies = sections.map(sec => ({
    title: sec,
    payload: sec.toLowerCase()
  }))
  controller.hears(
    "home",
    "message,direct_message",
    async (bot, message) => {
      await bot.reply(message, {
        text: `Welcome to ${resume.basics.name}'s interactive resume! 
        My name is Jobsy, how may I assist you?`,
        quick_replies,
      });
    }
  );

  controller.on("message,direct_message", async (bot, message) => {
    await bot.reply(message, ``);
  });
};


// Education

