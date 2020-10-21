/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// const resume = require("../resume.json")
const { BotkitConversation } = require("botkit");
const { createComputedPropertyName } = require("typescript");
const resume = require("../resume.json");
const store = require("../utils/store.js");
const titleize = require("titleize");
module.exports = function (controller) {
  // controller.hears('sample','message,direct_message', async(bot, message) => {
  //     await bot.reply(message, `${resume.basics.name}`);
  // });
  const onboarding = new BotkitConversation("onboarding", controller);
  const sections = Object.keys(resume).filter(
    (key) => key === "basics" || (resume[key] && resume[key].length)
  );
  sections.push("back");
  const quick_replies = sections.map((sec) => ({
    title: titleize(sec),
    payload: titleize(sec),
  }));
  // console.log(quick_replies)
  var botReply = {
    text: "Here are your options!",
    quick_replies
  };
  onboarding.addMessage({ type: "typing" }, "typing");
  onboarding.say(`Welcome to ${resume.basics.name}'s interactive resume!`);
  onboarding.say(`${resume.basics.name.split(' ')[0]} is currently open to opportunities!`);
  onboarding.say(`My name is Jobsy, how may I assist you?`);
  onboarding.say(botReply)

  controller.addDialog(onboarding)
  controller.on(["hello","welcome_back"], async (bot, message) => {
    store.createUser(message.user)
    const userStore = store.getUserStore(message.user)
    userStore.visit({
      text: `You're at the base level of ${resume.basics.name}'s resume.  \nChoose from the following options:`,
      quick_replies
    }, "home")
    await bot.beginDialog("onboarding");
  });

};
