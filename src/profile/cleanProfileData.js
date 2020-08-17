const logger = require('../logger')(__filename)
const pkg = require('../package')

const dateBreakPoint = ' – '

module.exports = (profile) => {
  if(!profile.profile.name) {
    const messageError = `LinkedIn website changed and ${pkg.name} ${pkg.version} can't read basic data. Please report this issue at ${pkg.bugs.url}`
    logger.error(messageError, '')
    throw new Error(messageError)
  }

  profile.profile.summary = profile.about.text

  profile.positions.forEach((position) => {
    if(position.title){
        position.title = position.title.replace('Company Name\n', '').replace('Nome da empresa\n', '')
    }
    if(position.description) {
      position.description = position.description.replace('See more', '').replace('visualizar mais', '');
	    position.description = position.description.replace('See less', '').replace('visualizar menos', '');
    }

    if(position.dateRange) {
      const [ dateStart, dateEnd ] = position.dateRange.split(dateBreakPoint)
      position.dateStart = dateStart
      position.dateEnd = dateEnd || dateStart
      delete position.dateRange
    }
    if(position.roles) {
      position.roles.forEach((role) => {
        if(role.title) {
          role.title = role.title.replace('Title\n', '').replace('Cargo\n', '')
        }
        if(role.description) {
          role.description = role.description.replace('See more', '').replace('visualizar mais', '')
          role.description = role.description.replace('see less', '').replace('visualizar menos', '')
        }
        if(role.dateRange) {
          const [ dateStart, dateEnd ] = role.dateRange.split(dateBreakPoint)
          role.dateStart = dateStart
          role.dateEnd = dateEnd || dateStart
          delete role.dateRange
        }
      })
    }
  })

  if(profile.recommendations && profile.recommendations.receivedCount) {
    profile.recommendations.receivedCount = profile.recommendations.receivedCount.replace(/[^\d]/g, '')
  }

  if(profile.recommendations && profile.recommendations.givenCount) {
    profile.recommendations.givenCount = profile.recommendations.givenCount.replace(/[^\d]/g, '')
  }

  if(profile.recommendations && profile.recommendations.received) {
    profile.recommendations.received.forEach((recommendation) => {
      if(recommendation.summary){
        recommendation.summary = recommendation.summary.replace('See more', '').replace('... Visualizar mais', '')
        recommendation.summary = recommendation.summary.replace('See less', '').replace('visualizar menos', '')
      }
    })
  }

  if(profile.recommendations && profile.recommendations.given) {
    profile.recommendations.given.forEach((recommendation) => {
      if(recommendation.summary){
        recommendation.summary = recommendation.summary.replace('See more', '').replace('... Visualizar mais', '')
        recommendation.summary = recommendation.summary.replace('See less', '').replace('visualizar menos', '')
      }
    })
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
    profile.skills = profile.skills.map(({ title, count }) => ({ title, count: count ? parseInt(count, 10) : 0  }))
  }

  if(profile.volunteerExperience) {
    profile.volunteerExperience = profile.volunteerExperience.map(volunteerExperience => {
      const volunteerExperienceObj = { ...volunteerExperience }
      if(volunteerExperienceObj.dateRange) {
        const [ dateStart, dateEnd ] = volunteerExperienceObj.dateRange.split(dateBreakPoint)
        volunteerExperienceObj.dateStart = dateStart
        volunteerExperienceObj.dateEnd = dateEnd || dateStart
        delete volunteerExperienceObj.dateRange
      }
      return volunteerExperienceObj
    })
  }

  if(profile.accomplishments) {
    profile.accomplishments = profile.accomplishments.map(accomplishment => ({ ...accomplishment, count: parseInt(accomplishment.count, 10) }))
  }
  
  return profile
}
