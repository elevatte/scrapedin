const openPage = require('../openPage')
const scrapSection = require('../scrapSection')
const scrapAccomplishmentPanel = require('./scrapAccomplishmentPanel')
const scrollToPageBottom = require('./scrollToPageBottom')
const seeMoreButtons = require('./seeMoreButtons')
const contactInfo = require('./contactInfo')
const template = require('./profileScraperTemplate')
const cleanProfileData = require('./cleanProfileData')
const wait = require('../wait')

const logger = require('../logger')(__filename)

module.exports = async (browser, cookies, url, waitTimeToScrapMs = 500, hasToGetContactInfo = true, puppeteerAuthenticate = undefined) => {
  logger.info(`starting scraping url: ${url}`)

  const page = await openPage({ browser, cookies, url, puppeteerAuthenticate })
  const profilePageIndicatorSelector = '.pv-profile-section'
  await page.waitFor(profilePageIndicatorSelector, { timeout: 5000 })
    .catch(() => {
      //why doesn't throw error instead of continuing scraping?
      //because it can be just a false negative meaning LinkedIn only changed that selector but everything else is fine :)
      logger.warn('profile selector was not found')
    })

  logger.info('scrolling page to the bottom')
  await scrollToPageBottom(page)
  
  if (waitTimeToScrapMs) {
    logger.info(`applying 1st delay`)
    await wait(180)
  }

  await seeMoreButtons.clickAll(page)

  // TODO: algumas das sessões abaixo estão comentadas pois não serão utilizadas no mvp
  const [profile] = await scrapSection(page, template.profile)
  const [about] = await scrapSection(page, template.about)
  const positions = await scrapSection(page, template.positions)
  const educations = await scrapSection(page, template.educations)
  // const [recommendationsCount] = await scrapSection(page, template.recommendations_count)
  // const recommendationsReceived = await scrapSection(page, template.recommendations_received)
  // const recommendationsGiven = await scrapSection(page, template.recommendations_given)
  const skills = await scrapSection(page, template.skills)
  // const accomplishments = await scrapSection(page, template.accomplishments)
  const courses = await scrapSection(page, template.courses)
  const languages = await scrapAccomplishmentPanel(page, 'languages')
  // const projects = await scrapAccomplishmentPanel(page, 'projects')
  const volunteerExperiences = await scrapSection(page, template.volunteer_experiences)
  // const peopleAlsoViewed = await scrapSection(page, template.people_also_viewed)

  const contacts = hasToGetContactInfo ? await contactInfo(page) : []

  await page.close()
  logger.info(`finished scraping url: ${url}`)

  const rawProfile = {
    profile,
    about,
    positions,
    educations,
    skills,
    courses,
    languages,
    volunteerExperiences,
    contacts
    // recommendations: {
    //   givenCount: recommendationsCount ? recommendationsCount.given : 0,
    //   receivedCount: recommendationsCount ? recommendationsCount.received : 0,
    //   given: recommendationsReceived,
    //   received: recommendationsGiven
    // },
    // accomplishments,
    // projects,
    // peopleAlsoViewed,
  }

  const cleanedProfile = cleanProfileData(rawProfile)
  return cleanedProfile
}
