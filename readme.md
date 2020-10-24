# Jobsy

A single page interactive resume exploration application built around a chatbot.

Jobsy took first place in [MintBean](https://www.mintbean.io/)'s "Hack the Chatbot" Hackathon.

### [Live Link](https://jobsy-app.herokuapp.com/)

![Jobsy feature](https://dannydash-seeds.s3-us-west-1.amazonaws.com/ReadMe/Jobsy/JobsyOG.png)

Jobsy is built around a [Botkit](https://botkit.ai) chatbot backend with Node.js and React integration on the front end.

## Notable Features
### Text Suggestions

<p align="center">
  <img src="https://raw.githubusercontent.com/tjmccabe/Jobsy/main/public/suggestions.png" alt="Suggestions"/>
</p>

If a user types something that doesn't match exactly to something on your resume, Jobsy uses fuzzyset to find the closest words to the input text. It then sends those suggestions back as quick reply buttons.

### History

Jobsy remembers users' history and gives them a "back" button at each step so that they can retrace their path through your resume.

<p align="center">
  <img src="https://raw.githubusercontent.com/tjmccabe/Jobsy/main/public/history.png" alt="History"/>
</p>

Once a resume leaf node (a node with no children) has been visited, Jobsy will present that option in a slightly different color with a check mark to indicate that a user has already seen it during their session.

### Exploration-Based Graphics

<p align="center">
  <img src="https://raw.githubusercontent.com/tjmccabe/Jobsy/main/public/graphics.png" alt="Graphics"/>
</p>

You can add a metadata key to any resume node. When that node is visited, the data in that key will be passed along to Jobsy's left-hand panel, delivering custom images, text, and hyperlinks at each step of your resume.
