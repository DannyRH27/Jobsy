const resume = require("../resume.json");
// const fName = resume.basics.name.split(' ')[0]

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

const timePeriod = (sd, ed, verb, place, work) => {
  if (!sd) return ''
  sd = sd.split("-")
  ed = ed ? ed.split("-") : ''
  const endTime = ed ? `${months[ed[1]]}, ${ed[0]}` : 'present'
  return endTime === 'present' ? (
    `I've been ${verb}ing ${work ? 'at ' : ''}*${place}* from *${months[sd[1]]}, ${sd[0]}* until *now*`
  ) : `I ${verb}ed ${work ? 'at ' : ''}*${place}* from *${months[sd[1]]}, ${sd[0]}* until *${endTime}*`
}

const formatDate = (date, startStr) => {
  if (!date) return ''
  date = date.split("-")
  return `${startStr} ${months[date[1]]} ${date[2]}, ${date[0]}`
}

const formatEndNode = (catName, entry) => {
  const lines = []
  if (catName === "work" || catName === "volunteer") {
    const comp = entry.company ? entry.company : entry.organization ? entry.organization : ""
    const timeStr = timePeriod(entry.startDate, entry.endDate, catName, comp, true)
    const roleStr = timeStr + ` in the role of *${entry.position}*`
    lines.push(roleStr + '.')
    if (entry.summary) lines.push('---  \n' + entry.summary)

    if (entry.highlights && entry.highlights.length) {
      lines.push(`---  \nHere are some highlights:`)
      entry.highlights.forEach(hl => lines.push("- " + hl))
    }
  } else if (catName === "education") {
    const timeStr = timePeriod(entry.startDate, entry.endDate, "attend", entry.institution, false)
    if (timeStr) lines.push(timeStr)

    const degreeText = entry.endDate ? 'I earned a' : 'I will earn a'
    if (entry.studyType) lines.push(`---  \n${degreeText} *${entry.studyType}* in *${entry.area}*.`)
    
    const gpaText = entry.endDate ? 'was' : 'is'
    if (entry.gpa) lines.push(`My GPA ${gpaText} *${entry.gpa}*.`)
    if (entry.courses && entry.courses.length) {
      lines.push(`---  \nHere's a list of some of my courses:`)
      entry.courses.forEach(course => lines.push("- " + course))
    }
  } else if (catName === "awards") {
    const awarderText = entry.awarder ? ` from *${entry.awarder}*` : ''
    const ds = entry.date ? entry.date.split('-') : ''
    const dateStr = ds ? ` in *${months[ds[1]]}, ${ds[0]}*` : ''
    lines.push(`I earned the *${entry.title}* award${awarderText}${dateStr}!`)
    if (entry.summary) lines.push(`---  \n${entry.summary}`)
  } else if (catName === "publications") {
    lines.push(`Here's a little about my ${entry.name} publication:`)
    const dateStr = formatDate(entry.releaseDate, "Date published:")
    if (dateStr) lines.push(dateStr)
    if (entry.publisher) lines.push(`Published by ${entry.publisher}`)
    if (entry.website) lines.push(`Published at ${entry.website}`)
    if (entry.summary) lines.push(`Summary: ${entry.summary}`)
  } else if (catName === "projects") {
    lines.push(`*${entry.title}*: ${entry.summary}`)
    if (entry.liveUrl || entry.gitUrl) lines.push('---')
    if (entry.liveUrl) lines.push(`*[Live Link](${entry.liveUrl})*`)
    if (entry.gitUrl) lines.push(`*[GitHub Link](${entry.gitUrl})*`)
    if (entry.technologies && entry.technologies.length) {
      lines.push(`---  \nHere are some of the key technologies I used on ${entry.title}:  \n&nbsp;&nbsp;&nbsp;&nbsp;${entry.technologies.join(", ")}`)
    }
  } else if (catName === "skills") {
    lines.push(`I'm skilled at *${entry.name}*!`)
    if (entry.level) lines.push(`I would describe my level of familiarity as *${entry.level}*.`)
    const yrText = (entry.years && entry.years != 1) ? "years" : "year"
    if (entry.years) lines.push(`I have *${entry.years} ${yrText}* of experience with ${entry.name}.`)
    const relevantProjects = resume.projects && resume.projects.length ? (
      resume.projects.filter(proj => proj.technologies.includes(entry.name))
    ) : []
    if (relevantProjects.length) lines.push(`---  \nCheck out my relevant project(s) that use *${entry.name}*:  \n`)
    relevantProjects.forEach(proj => {
      lines.push(`- *[${proj.title}](${proj.liveUrl})*`)
    })
  } else if (catName === "languages") {
    lines.push(`I speak *${entry.language}* at the *${entry.fluency}* level.`)
  } else if (catName === "interests") {
    lines.push(`I'm interested in *${entry.name}*!`)
    if (entry.keywords && entry.keywords.length) {
      lines.push(`Here are some specifics:`)
      entry.keywords.forEach(keyword => lines.push("- " + keyword))
    }
  } else if (catName === "references") {
    lines.push(`*${entry.name}* was my ${entry.reference}.`)
    if (entry.contact) lines.push(`Contact info: ${entry.contact}`)
  } else if (catName === "profiles") {
    lines.push(`*[Click here](${entry.url})* to head over to my ${entry.network} profile!`)
  }
  return lines.join("  \n")
}

const formatCategoryText = (title) => {
  const choose = '  \n<div class="smoller">Choose one to find out more!</div>'
  let response;

  switch (title) {
    case "basics":
      response = `What would you like to know about me?`
      break;
    case "work":
      response = `I have worked at the following companies:${choose}`
      break;
    case "volunteer":
      response = `I have volunteered for the following organizations:${choose}`
      break;
    case "education":
      response = `I have studied at the following institutions:${choose}`
      break;
    case "projects":
      response = `Here are some of my most interesting projects:${choose}`
      break;
    case "awards":
      response = `I have received the following awards:${choose}`
      break;
    case "publications":
      response = `These are my most noteworthy publications:${choose}`
      break;
    case "skills":
      response = `I'm skilled in the following areas:${choose}`
      break;
    case "languages":
      response = `I am proficient in the following languages:${choose}`
      break;
    case "interests":
      response = `Here are some of my interests:${choose}`
      break;
    case "references":
      response = `Here are some of my references:${choose}`
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
      response = `My email address is *<${resume.basics.email}>*.`
      break;
    case "phone":
      response = `My phone number is *${resume.basics.phone}*.`
      break;
    case "website":
      response = `Check out my website at *<${resume.basics.website}>*!`
      break;
    case "profiles":
      response = `Check out some of my online profiles:`
      break;
    case "location":
      const loc = resume.basics.location
      response = `Here's my location:  \n`
      if (loc.address) response += `${loc.address}  \n`
      if (loc.city) {
        response += `${loc.city}`
        if (loc.postalCode) response += `, ${loc.postalCode}`
        response += '  \n'
      }
      break;
    case "contact":
      response = ''
      if (resume.basics.email) response += `My email address is *<${resume.basics.email}>*.  \n`
      if (resume.basics.phone) response += `My phone number is *${resume.basics.phone}*.  \n`
      const loc2 = resume.basics.location
      if (loc2) {
        response += `Here's my location:  \n`
        if (loc2.address) response += `${loc2.address}  \n`
        if (loc2.city) {
          response += `${loc2.city}`
          if (loc2.postalCode) response += `, ${loc2.postalCode}`
          response += '  \n'
        }
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
