const resume = require("../resume.json");
const FuzzySet = require("fuzzyset.js");
const titleize = require("titleize");

const nodes = []

for (let key in resume) { nodes.push(titleize(key)) }

const basicsKeyMap = {
  yourself: "Tell me about yourself",
  email: "Email",
  phone: "Phone",
  location: "Location",
  website: "Website",
  profiles: "Profiles"
}

const basicsKeys = Object.keys(basicsKeyMap)
  .filter(key => resume.basics[key])
  .map(key => basicsKeyMap[key])

basicsKeys.forEach(bk => nodes.push(bk))

if (resume.basics.profiles && resume.basics.profiles.length) {
  resume.basics.profiles.forEach(prof => { nodes.push(prof.network) })
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

for (let i = 0; i < categories.length; i++) {
  const [catName, catTitle] = categories[i]
  const arr = resume[catName]
  if (arr) arr.forEach(entry => { nodes.push(entry[catTitle]) })
}

// console.log(nodes)

const wordsArray = FuzzySet()

nodes.forEach(node => wordsArray.add(node))

const getSuggestions = (word) => {
  return wordsArray.get(word);
}


module.exports = {
  getSuggestions
}