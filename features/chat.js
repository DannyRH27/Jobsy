/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require("express");
const path = require("path");
const resume = require("../resume.json");

const resumeScan = (section, name) => {
  if (!section.length) return false;
  return section.map((entry) => ({ title: entry[name], payload: entry[name] }));
};

module.exports = function (controller) {
  // make public/index.html available as localhost/index.html
  // by making the /public folder a static/public asset
  controller.publicFolder("/", path.join(__dirname, "..", "dist"));
  // controller.publicFolder("/", path.join(__dirname, "..", "public"));

  console.log("Chat with me: http://localhost:" + (process.env.PORT || 3000));
  controller.hears("home", "message,direct_message", async (bot, message) => {
    const sections = Object.keys(resume).filter(
      (key) => key === "basics" || (resume[key] && resume[key].length)
    );
    sections.push("back");
    const quick_replies = sections.map((sec) => ({
      title: sec,
      payload: sec.toLowerCase(),
    }));
    await bot.reply(message, {
      text: `Welcome to ${resume.basics.name}'s interactive resume! 
        My name is Jobsy, how may I assist you?`,
      quick_replies,
    });
  });

  controller.hears("work", "message,direct_message", async (bot, message) => {
    const sections = resumeScan(resume.work, "company");
    // if that was false, prevent moving to "work"
    sections.push({ title: "bafhadshguifsck", payload: "back" });
    const quick_replies = sections;
    console.log(quick_replies);
    await bot.reply(message, {
      text: `Which company do you want to know about?`,
      quick_replies,
    });
  });

  // controller.on("message,direct_message", async (bot, message) => {
  //   await bot.reply(message, { text: "COOL, YO", something: "thing" });
  // });
};

// Education
