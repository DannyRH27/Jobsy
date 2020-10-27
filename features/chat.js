/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const autocorrect = require("../utils/autocorrect")
const fr = require("../utils/fp_format.js");
const express = require("express");
const path = require("path");
const store = require("../utils/store");
const resume = require("../resume.json");
const fName = resume.basics.name.split(' ')[0]
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
      text: `Welcome back to my interactive resume! 
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

  const basicsKeys = ['contact']
  Object.keys(resume.basics).forEach(key => {
    const nots = new Set(['name', 'label', 'picturePath', 'openToOpps', 'yourself'])
    if (!nots.has(key)) {
      if (key === "profiles") {
        if (resume.basics.profiles && resume.basics.profiles.length) basicsKeys.push(key)
      } else if (key === "location") {
        if (resume.basics.location && resume.basics.location.city) basicsKeys.push(key)
      } else if (resume.basics[key]) {
        basicsKeys.push(key)
      }
    }
  })

  controller.hears("basics", "message, direct_message", async (bot, message) => {
    await bot.reply(message, { type: "typing" });
    const userStore = store.getUserStore(message.user)
    const noThanks = new Set(['email', 'phone', 'location'])

    const orig_replies = basicsKeys.filter(key => !noThanks.has(key))
    .map(key => ({
      title: titleize(key),
      payload: titleize(key),
      visited: userStore.isVisited(key)
    }))

    if (resume.basics.yourself) orig_replies.unshift(
      {
        title: "Tell me about yourself",
        payload: "Tell me about yourself",
        visited: userStore.isVisited("Tell me about yourself")
      }
    )

    const quick_replies = orig_replies.concat(extra_replies)

    const botReply = {
      text: fr.formatCategoryText("basics"),
      quick_replies
    }

    userStore.visit(botReply, '')
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, botReply);
    }, 1000);
  })

  if (resume.basics.yourself) {
    controller.hears(/your ?self/, "message, direct_message", async (bot, message) => {
      await bot.reply(message, { type: "typing" });
      const userStore = store.getUserStore(message.user)
      const quick_replies = extra_replies
  
      const botReply = {
        text: resume.basics.yourself,
        quick_replies
      }
  
      userStore.visit(botReply, "Tell me about yourself")
      setTimeout(async () => {
        // will have to reset context because turn has now ended.
        await bot.changeContext(message.reference);
        await bot.reply(message, botReply);
      }, 1000);
    })
  }

  for (let i = 0; i < basicsKeys.length; i++) {
    const key = basicsKeys[i]
    controller.hears(key, "message, direct_message", async (bot, message) => {
      await bot.reply(message, { type: "typing" });
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
      setTimeout(async () => {
        // will have to reset context because turn has now ended.
        await bot.changeContext(message.reference);
        await bot.reply(message, botReply);
      }, 1000);
    })
  }

  if (resume.basics.profiles && resume.basics.profiles.length) {
    for (let i = 0; i < resume.basics.profiles.length; i++) {
      const prof = resume.basics.profiles[i]
      const nodeText = fr.formatEndNode("profiles", prof)

      controller.hears(prof.network, "message, direct_message", async (bot, message) => {
        await bot.reply(message, { type: "typing" });
        const userStore = store.getUserStore(message.user)
        
        const botReply = {
          text: nodeText,
          entry: prof,
          quick_replies: extra_replies
        }

        userStore.visit(botReply, prof.network)
        setTimeout(async () => {
          // will have to reset context because turn has now ended.
          await bot.changeContext(message.reference);
          await bot.reply(message, botReply);
        }, 1000);
      })
    }
  }

  const categories = [
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

  for (let i = 0 ; i < categories.length; i++) {
    const [catName, title] = categories[i]
    if (!resume.hasOwnProperty(catName) || !resume[catName].length) {
      // make an unavailable message and continue
      controller.hears(catName, "message, direct_message", async (bot, message) => {
        await bot.reply(message, { type: "typing" });
        const quick_replies = extra_replies

        let replyText = `There are no listings for *${catName}* on my resume.  
        Why not ask me about it by emailing *<${resume.basics.email}>*?`
        const botReply = {
          text: replyText,
          quick_replies
        }
        setTimeout(async () => {
          // will have to reset context because turn has now ended.
          await bot.changeContext(message.reference);
          await bot.reply(message, botReply);
        }, 1000);
      })
      continue
    }


    // make responses for each category name
    controller.hears(catName, "message, direct_message", async(bot, message) => {
      await bot.reply(message, { type: "typing" });
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
      setTimeout(async () => {
        // will have to reset context because turn has now ended.
        await bot.changeContext(message.reference);
        await bot.reply(message, botReply);
      }, 1000);
    })
    
    // make responses for each listing in each category
    for (let j = 0; j < resume[catName].length; j++) {
      const entry = resume[catName][j]
      const nodeText = fr.formatEndNode(catName, entry)

      controller.hears(entry[title], "message, direct_message", async (bot, message) => {
        await bot.reply(message, { type: "typing" });
        const userStore = store.getUserStore(message.user)
        // console.log(entry)
        const botReply = {
          text: nodeText,
          entry,
          quick_replies: extra_replies
        }
        // console.log(userStore.history)
        
        userStore.visit(botReply, entry[title])
        setTimeout(async () => {
          // will have to reset context because turn has now ended.
          await bot.changeContext(message.reference);
          await bot.reply(message, botReply);
        }, 1000);
      })
    }
  }


// // Catch All
  controller.on("message,direct_message", async (bot, message) => {
    await bot.reply(message, { type: "typing" });
    const userStore = store.getUserStore(message.user)

    const autocorrections = autocorrect.getSuggestions(message.text) || []
    const suggestedReplies = autocorrections.map(ac => ({
      title: ac[1],
      payload: ac[1],
      visited: userStore.isVisited(ac[1])
    }))

    const response =
      autocorrections.length
        ? `Did you mean to check out my experience with one of these?`
        : `Sorry, I didn't understand '${message.text}'. Could you repeat that one more time?`;
        
    const botReply = { text: response, quick_replies: suggestedReplies.concat(extra_replies) }
    userStore.visit(botReply, '')
    setTimeout(async () => {
      // will have to reset context because turn has now ended.
      await bot.changeContext(message.reference);
      await bot.reply(message, botReply);
    }, 1000);
  });
};



