/*
PUT ME BACK IN FEATURES IF YOU WANT TO USE THIS AS JOBSY
*/

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
*/
const { BotkitConversation } = require("botkit");
const { createComputedPropertyName } = require("typescript");
const resume = require("../resume.json");
const fName = resume.basics.name.split(' ')[0]
const store = require("./store.js");
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
    text: "Here are your options!",
    quick_replies
  };
  onboarding.addMessage({ type: "typing" }, "typing");
  onboarding.say(`Welcome to ${resume.basics.name}'s interactive resume!`);
  onboarding.say(`${fName} is currently open to opportunities!`);
  onboarding.say(`My name is Jobsy, how may I assist you?`);
  onboarding.say(botReply)

  controller.addDialog(onboarding)
  controller.on(["hello","welcome_back"], async (bot, message) => {
    store.createUser(message.user)
    const userStore = store.getUserStore(message.user)
    userStore.visit({
      text: `You're at the base level of ${resume.basics.name}'s resume.  \nChoose from the following options:`,
      quick_replies
    }, '')
    await bot.beginDialog("onboarding");
  });

};
