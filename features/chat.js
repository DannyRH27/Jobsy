/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const autocorrect = require("../utils/autocorrect")
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

  const extra_replies = [
    {title: "Back", payload: "Back", special: true},
    {title: "Home", payload: "Home", special: true}
  ]

  controller.hears("home", "message, direct_message", async (bot, message) => {
    const sections = Object.keys(resume).filter(key => key === "basics" || (resume[key] && resume[key].length))
    const userStore = store.getUserStore(message.user)

    const quick_replies = sections
      .map((sec) => ({
        title: titleize(sec),
        payload: titleize(sec),
        visited: userStore.isVisited(sec)
      })).concat([extra_replies[0]]);

    const botReply = {
      text: `Welcome back to ${resume.basics.name}'s interactive resume! 
        Here are your options!`,
      quick_replies
    }
    
    userStore.visit(botReply, '')
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
    })).concat(extra_replies)

    const botReply = {
      text: fr.formatCategoryText("basics"),
      quick_replies
    }

    userStore.visit(botReply, '')
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
      extra_replies.forEach(rep => quick_replies.push(rep))

      
      const text = fr.formatBasicsText(key)
      const botReply = {text, quick_replies}

      userStore.visit(botReply, key === "profiles" ? '' : key)
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
          entry: prof,
          quick_replies: extra_replies
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
    ["projects", "title"],
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
        .concat(extra_replies)
      // if (quick_replies === false), make an "unavailable" response here
      
      const catText = fr.formatCategoryText(catName)
      const botReply = {
        text: catText,
        quick_replies
      }

      userStore.visit(botReply, '')
      await bot.reply(message, botReply)
    })
    
    // make responses for each listing in each category
    for (let j = 0; j < resume[catName].length; j++) {
      const entry = resume[catName][j]
      const nodeText = fr.formatEndNode(catName, entry)

      controller.hears(entry[title], "message, direct_message", async (bot, message) => {
        const userStore = store.getUserStore(message.user)
        
        const botReply = {
          text: nodeText,
          entry,
          quick_replies: extra_replies
        }
        // console.log(userStore.history)
        
        userStore.visit(botReply, entry[title])
        await bot.reply(message, botReply)
      })
    }
  }


// // Catch All
  controller.on("message,direct_message", async (bot, message) => {
    console.log(typeof message.text)
    const correction =
      message.text.length < "publications".length
        ? autocorrect.correct(message.text)
        : message.text;

    const response =
      message.text === correction
        ? `Sorry, I didn't understand '${correction}'. Could you repeat that one more time?`
        : `Did you mean to check out ${resume.basics.name.split(' ')[0]}'s experience with ${correction}?`;

    await bot.reply(message, { text: response, quick_replies: extra_replies });
  });
};



