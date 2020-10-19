/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
// const resume = require("../resume.json")
const { BotkitConversation } = require("botkit");
const { createComputedPropertyName } = require("typescript");
const resume = require("../resume.json");
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
  var reply = {
    text: "Here are your options!",
    quick_replies
  };
  onboarding.addMessage({ type: "typing" }, "typing");
  onboarding.say(`Welcome to ${resume.basics.name}'s interactive resume!`);
  onboarding.say(`${resume.basics.name} is currently open to opportunities!`);
  onboarding.say(`My name is Jobsy, how may I assist you?`);
  onboarding.say(reply)

  controller.addDialog(onboarding)
  controller.on(["hello","welcome_back"], async (bot, message) => {
    await bot.beginDialog("onboarding");

  });

};
