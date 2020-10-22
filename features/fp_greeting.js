/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
*/
const { BotkitConversation } = require("botkit");
const resume = require("../resume.json");
const fName = resume.basics.name.split(' ')[0]
const store = require("../utils/store.js");
const titleize = require("titleize");
module.exports = function (controller) {

  const onboarding = new BotkitConversation("onboarding", controller);
  const sections = Object.keys(resume).filter(
    (key) => key === "basics" || (resume[key] && resume[key].length)
  );

  const quick_replies = sections.map((sec) => ({
    title: titleize(sec),
    payload: titleize(sec),
  }));

  var botReply = {
    text: "Choose any of these options to find out more about me:",
    quick_replies
  };
  onboarding.addMessage({ type: "typing" }, "typing");
  onboarding.say(`Hi, I'm ${resume.basics.name}. Welcome to my interactive resume!`);
  if (resume.basics.openToOpps) onboarding.say(`I'm currently open to opportunities!`);
  onboarding.say(botReply)

  controller.addDialog(onboarding)
  controller.on(["hello", "welcome_back"], async (bot, message) => {
    store.createUser(message.user)
    const userStore = store.getUserStore(message.user)
    userStore.visit({
      text: `You're at the base level of my resume.  \nPlease choose from the following options:`,
      quick_replies
    }, '')
    await bot.beginDialog("onboarding");
  });

};
