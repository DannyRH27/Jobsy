const resume = require("../resume.json");
const fName = resume.basics.name.split(' ')[0]

const months = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
}

const timePeriod = (sd, ed) => {
  if (!sd) return ''
  sd = sd.split("-")
  ed = ed ? ed.split("-") : ''
  const endTime = ed ? `${months[ed[1]]}, ${ed[0]}` : 'present'
  return `Timeframe: ${months[sd[1]]}, ${sd[0]} to ${endTime}`
}

const formatDate = (date, startStr) => {
  if (!date) return ''
  date = date.split("-")
  return `${startStr}: ${months[date[1]]} ${date[2]}, ${date[0]}`
}

const formatEndNode = (catName, entry) => {
  const lines = []
  if (catName === "work" || catName === "volunteer") {
    const comp = entry.company ? entry.company : entry.organization ? entry.organization : ""
    if (comp) lines.push(`${fName}'s time at ${comp}:`)
    if (entry.position) lines.push(`Position: ${entry.position}`)
    if (entry.summary) lines.push(`Summary: ${entry.summary}`)

    const timeStr = timePeriod(entry.startDate, entry.endDate)
    if (timeStr) lines.push(timeStr)
    
    if (entry.highlights && entry.highlights.length) {
      lines.push(`Highlights:`)
      entry.highlights.forEach(hl => lines.push("- " + hl))
    }
  } else if (catName === "education") {
    lines.push(`${fName}'s time at ${entry.institution}:`)
    if (entry.studyType) lines.push(`Certificate: ${entry.studyType}`)
    if (entry.area) lines.push(`Area of Focus: ${entry.area}`)
    
    const timeStr = timePeriod(entry.startDate, entry.endDate)
    if (timeStr) lines.push(timeStr)
    
    if (entry.gpa) lines.push(`GPA: ${entry.gpa}`)
    if (entry.courses && entry.courses.length) {
      lines.push(`Courses:`)
      entry.courses.forEach(course => lines.push("- " + course))
    }
  } else if (catName === "awards") {
    lines.push(`${fName}'s ${entry.title} award:`)
    const dateStr = formatDate(entry.date, "Date awarded")
    if (dateStr) lines.push(dateStr)
    if (entry.awarder) lines.push(`Received from ${entry.awarder}`)
    if (entry.summary) lines.push(`Summary: ${entry.summary}`)
  } else if (catName === "publications") {
    lines.push(`${fName}'s ${entry.name} publication:`)
    const dateStr = formatDate(entry.releaseDate, "Date published")
    if (dateStr) lines.push(dateStr)
    if (entry.publisher) lines.push(`Published by ${entry.publisher}`)
    if (entry.website) lines.push(`Published at ${entry.website}`)
    if (entry.summary) lines.push(`Summary: ${entry.summary}`)
  } else if (catName === "skills") {
    lines.push(`${fName}'s ${entry.name} skills:`)
    if (entry.level) lines.push(`Level: ${entry.level}`)
    if (entry.keywords && entry.keywords.length) {
      lines.push(`Areas of expertise:`)
      entry.keywords.forEach(keyword => lines.push("- " + keyword))
    }
  } else if (catName === "languages") {
    lines.push(`${fName} speaks ${entry.language} at the ${entry.fluency} level`)
  } else if (catName === "interests") {
    lines.push(`${fName} is interested in ${entry.name}`)
    if (entry.keywords && entry.keywords.length) {
      lines.push(`Keywords:`)
      entry.keywords.forEach(keyword => lines.push("- " + keyword))
    }
  } else if (catName === "references") {
    lines.push(`${entry.name} is a reference for ${fName}`)
    if (entry.reference) lines.push(`Relationship: ${entry.reference}`)
  } else if (catName === "profiles") {
    lines.push(`[Click here](${entry.url}) to go to ${fName}'s ${entry.network} profile!`)
  }
  return lines.join("  \n")
}

const formatCategoryText = (title) => {
  const choose = "  \nChoose one to find out more!"
  let response;

  switch (title) {
    case "basics":
      response = `What would you like to know about ${fName}?`
      break;
    case "work":
      response = `${fName} has worked at the following companies:${choose}`
      break;
    case "volunteer":
      response = `${fName} has volunteered for the following organizations:${choose}`
      break;
    case "education":
      response = `${fName} has studied at the following institutions:${choose}`
      break;
    case "awards":
      response = `${fName} has received the following awards:${choose}`
      break;
    case "publications":
      response = `These are ${fName}'s most noteworthy publications':${choose}`
      break;
    case "skills":
      response = `${fName} is proficient in the following areas:${choose}`
      break;
    case "languages":
      response = `${fName} is proficient in the following languages:${choose}`
      break;
    case "interests":
      response = `Here are some of ${fName}'s interests:${choose}`
      break;
    default:
      response = ''
  }
  return response
}

const formatBasicsText = (title) => {
  // const choose = "  \nChoose one to find out more!"
  let response;

  switch (title) {
    case "email":
      response = `${fName}'s email is ${resume.basics.email}`
      break;
    case "phone":
      response = `${fName}'s phone number is ${resume.basics.phone}`
      break;
    case "website":
      response = `${fName}'s website is ${resume.basics.website}`
      break;
    case "summary":
      response = `Here is a summary of ${fName}:  \n${resume.basics.summary}`
      break;
    case "profiles":
      response = `Here are some of ${fName}'s online profiles:`
      break;
    case "location":
      const loc = resume.basics.location
      response = `${fName}'s location is:  \n`
      if (loc.address) response += `${loc.address}  \n`
      if (loc.city) {
        response += `${loc.city}`
        if (loc.postalCode) response += `, ${loc.postalCode}`
        response += '  \n'
      }
      break;
    default:
      response = ''
  }
  return response
}

module.exports = {
  formatEndNode,
  formatCategoryText,
  formatBasicsText
}
