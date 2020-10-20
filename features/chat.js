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

  controller.hears("home", "message, direct_message", async (bot, message) => {
    const sections = Object.keys(resume).filter(key => key === "basics" || (resume[key] && resume[key].length))

    const quick_replies = sections
      .map((sec) => ({
        title: titleize(sec),
        payload: titleize(sec),
      }));

    const botReply = {
      text: `Welcome back to ${resume.basics.name}'s interactive resume! 
        Here are your options!`,
      quick_replies
    }
    
    const userStore = store.getUserStore(message.user)
    userStore.visit(botReply, "home")
    await bot.reply(message, botReply);
  });

  controller.hears("back", "message, direct_message", async (bot, message) => {
    const userStore = store.getUserStore(message.user)
    const previousResponse = userStore.lastVisited()
    if (previousResponse.hasOwnProperty('quick_replies')) {
      previousResponse.quick_replies.forEach(qr => {
        qr.visited = userStore.isVisited(qr.title)
      })
    }
    await bot.reply(message, previousResponse)
  })

  const basicsKeys = []
  Object.keys(resume.basics).forEach(key => {
    if (key === "name" || key === "label" || key === "picture") {
    } else if (key === "profiles") {
      if (resume.basics.profiles && resume.basics.profiles.length) basicsKeys.push(key)
    } else if (key === "location") {
      if (resume.basics.location && resume.basics.location.city) basicsKeys.push(key)
    } else if (resume.basics[key]) basicsKeys.push(key)
  })

  controller.hears("basics", "message, direct_message", async (bot, message) => {
    const userStore = store.getUserStore(message.user)

    const quick_replies = basicsKeys.map(key => ({
      title: titleize(key),
      payload: titleize(key),
      visited: userStore.isVisited(key)
    }))

    const botReply = {
      text: fr.formatCategoryText("basics"),
      quick_replies
    }

    userStore.visit(botReply, "basics")
    await bot.reply(message, botReply)
  })

  for (let i = 0; i < basicsKeys.length; i++) {
    const key = basicsKeys[i]
    controller.hears(key, "message, direct_message", async (bot, message) => {
      const userStore = store.getUserStore(message.user)

      const quick_replies = []
      if (key === "profiles") {
        resume.basics.profiles.forEach(prof => {
          quick_replies.push({
            title: prof.network,
            payload: prof.network,
            entry: prof,
            visited: userStore.isVisited(prof.network)
          })
        })
      }

      
      const text = fr.formatBasicsText(key)
      const botReply = quick_replies.length ? {text, quick_replies} : {text}

      userStore.visit(botReply, key)
      await bot.reply(message, botReply)
    })
  }

  if (resume.basics.profiles && resume.basics.profiles.length) {
    for (let i = 0; i < resume.basics.profiles.length; i++) {
      const prof = resume.basics.profiles[i]
      const nodeText = fr.formatEndNode("profiles", prof)

      controller.hears(prof.network, "message, direct_message", async (bot, message) => {
        const userStore = store.getUserStore(message.user)
        
        const botReply = {
          text: nodeText,
          entry: prof
        }

        userStore.visit(botReply, prof.network)
        await bot.reply(message, botReply)
      })
    }
  }

  categories = [
    ["work", "company"],
    ["volunteer", "organization"],
    ["education", "institution"],
    ["awards", "title"],
    ["publications", "name"],
    ["skills", "name"],
    ["languages", "language"],
    ["interests", "name"],
    ["projects", "title"],
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
      // if (quick_replies === false), make an "unavailable" response here
      
      const catText = fr.formatCategoryText(catName)
      const botReply = {
        text: catText,
        quick_replies
      }

      userStore.visit(botReply, catName)
      await bot.reply(message, botReply)
    })
    
    // make responses for each listing in each category
    if (!resume[catName].length) continue
    for (let j = 0; j < resume[catName].length; j++) {
      const entry = resume[catName][j]
      const nodeText = fr.formatEndNode(catName, entry)

      controller.hears(entry[title], "message, direct_message", async (bot, message) => {
        const userStore = store.getUserStore(message.user)
        
        const botReply = {
          text: nodeText,
          entry
        }
        // console.log(userStore.history)
        
        userStore.visit(botReply, entry[title])
        await bot.reply(message, botReply)
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



