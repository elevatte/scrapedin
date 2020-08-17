const logger = require('../logger')(__filename)
const pkg = require('../package')

const dateBreakPoint = ' – '

const toInt = (strNumber) => strNumber ? parseInt(strNumber, 10) : 0

module.exports = (profile) => {
  if(!profile.profile.name) {
    const messageError = `LinkedIn website changed and ${pkg.name} ${pkg.version} can't read basic data. Please report this issue at ${pkg.bugs.url}`
    logger.error(messageError, '')
    throw new Error(messageError)
  }

  profile.profile.summary = profile.about.text
  delete profile.about

  profile.positions.forEach((position) => {
    if(position.title){
        position.title = position.title.replace('Company Name\n', '').replace('Nome da empresa\n', '')
    }
    if(position.description) {
      position.description = position.description.replace('See more', '').replace('visualizar mais', '');
	    position.description = position.description.replace('See less', '').replace(' Visualizar menos', '');
    }

    if(position.date_range) {
      const [ dateStart, dateEnd ] = position.date_range.split(dateBreakPoint)
      position.date_start = dateStart
      position.date_end = dateEnd || dateStart
      delete position.date_range
    }
    if(position.roles) {
      position.roles.forEach((role) => {
        if(role.title) {
          role.title = role.title.replace('Title\n', '').replace('Cargo\n', '')
        }
        if(role.description) {
          role.description = role.description.replace('See more', '').replace('visualizar mais', '')
          role.description = role.description.replace('see less', '').replace(' Visualizar menos', '')
        }
        if(role.date_range) {
          const [ dateStart, dateEnd ] = role.date_range.split(dateBreakPoint)
          role.date_start = dateStart
          role.date_end = dateEnd || dateStart
          delete role.date_range
        }
      })
    }
  })

  if(profile.recommendations) {
    if(profile.recommendations.receivedCount) {
      const receivedCount = profile.recommendations.receivedCount.replace(/[^\d]/g, '')
      profile.recommendations.received_count = toInt(receivedCount)
      delete profile.recommendations.receivedCount
    }
  
    if(profile.recommendations.givenCount) {
      const givenCount = profile.recommendations.givenCount.replace(/[^\d]/g, '')
      profile.recommendations.given_count = toInt(givenCount)
      delete profile.recommendations.givenCount
    }
  
    if(profile.recommendations.received) {
      profile.recommendations.received.forEach((recommendation) => {
        if(recommendation.text){
          recommendation.text = recommendation.text.replace('See more', '').replace('... Visualizar mais', '')
          recommendation.text = recommendation.text.replace('See less', '').replace('visualizar menos', '')
        }
      })
    }
  
    if(profile.recommendations.given) {
      profile.recommendations.given.forEach((recommendation) => {
        if(recommendation.text){
          recommendation.text = recommendation.text.replace('See more', '').replace('... Visualizar mais', '')
          recommendation.text = recommendation.text.replace('See less', '').replace('visualizar menos', '')
        }
      })
    }
  }


  if(profile.courses){
    profile.courses = profile.courses.map(({ name, date, institution }) => {
      const coursesObj = {
        institution
      }
      if(name) {
        coursesObj.name = name.replace('Course name\n', '').replace('Nome do Curso\n', '')
      }
      if(date) {
        coursesObj.date = date.replace('Course number\n', '').replace('Issued ', '').replace('No Expiration Date', '').replace('Emitido em ', '').replace('Nenhuma data de expiração', '')
      }
      return coursesObj
    }
    );
  }

  if(profile.languages){
    profile.languages = profile.languages.map(({ name, proficiency }) => ({
      name: name ? name.replace('Language name\n', '').replace('Idioma\n', '') : undefined,
      proficiency,
    }));
  }

  if(profile.projects){
    profile.projects = profile.projects.map(
      ({ name, date, description, link }) => ({
        name: name ? name.replace('Project name\n', '').replace('Nome do projeto\n', '') : undefined,
        date,
        description: description ? description.replace('Project description\n', '').replace('Descrição do projeto\n', '') : undefined,
        link,
      }),
    );
  }

  if(profile.skills) {
    profile.skills = profile.skills.map(({ title, count }) => ({ title, count: toInt(count) }))
  }

  if(profile.volunteerExperiences) {
    profile.volunteer_experiences = profile.volunteerExperiences.map(volunteerExperience => {
      const volunteerExperienceObj = { ...volunteerExperience }
      if(volunteerExperienceObj.date_range) {
        const [ dateStart, dateEnd ] = volunteerExperienceObj.date_range.split(dateBreakPoint)
        volunteerExperienceObj.date_start = dateStart
        volunteerExperienceObj.date_end = dateEnd || dateStart
        delete volunteerExperienceObj.date_range
      }
      return volunteerExperienceObj
    })
    delete profile.volunteerExperiences
  }

  if(profile.accomplishments) {
    profile.accomplishments = profile.accomplishments.map(accomplishment => ({ ...accomplishment, count: toInt(accomplishment.count) }))
  }
  
  if(profile.peopleAlsoViewed) {
    profile.people_also_viewed = profile.peopleAlsoViewed
    delete profile.peopleAlsoViewed
  }

  return profile
}
