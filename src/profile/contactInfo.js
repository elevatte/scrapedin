const logger = require('../logger')(__filename)
const scrapSection = require('../scrapSection')
const profileTemplate = require('./profileScraperTemplate')

const SEE_MORE_SELECTOR = 'a[data-control-name=contact_see_more]'
const CLOSE_MODAL_SELECTOR = '.artdeco-modal__dismiss'

const getContactInfo = async(page) => {
  await page.waitFor(SEE_MORE_SELECTOR, { timeout: 2000 })
    .catch(() => {
      logger.warn('contact-info', 'selector not found')
      return {}
    })

  const element = await page.$(SEE_MORE_SELECTOR)
  if(element){
    await element.click()
    const contactInfoIndicatorSelector = '#pv-contact-info'
    await page.waitFor(contactInfoIndicatorSelector, { timeout: 5000 })
        .catch(() => {
          logger.warn('contact info was not found')
        })
    
    const contactInfo = await scrapSection(page, profileTemplate.contacts)
    const closeButton = await page.$(CLOSE_MODAL_SELECTOR)
    if(closeButton)
      await closeButton.click()

    return contactInfo
  }
  
}

module.exports = getContactInfo
