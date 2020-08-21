const logger = require('../logger')(__filename)
const seeMoreButtons = [
  {
    id: 'SHOW_MORE_ABOUT',
    selector: '#line-clamp-show-more-button',
  },
  {
    id: 'SHOW_MORE_EXPERIENCES',
    selector: '#experience-section .pv-profile-section__see-more-inline',
  },
  {
    id: 'SEE_MORE_EXPERIENCES',
    selector: '#experience-section .inline-show-more-text__button',
  },
  {
    id: 'SHOW_MORE_CERTIFICATIONS',
    selector: '#certifications-section .pv-profile-section__see-more-inline',
  },
  {
    id: 'SHOW_MORE_SKILLS',
    selector: '.pv-skills-section__additional-skills',
  },
  {
    id: 'SEE_MORE_RECOMMENDATIONS',
    selector: '.recommendations-inlining #line-clamp-show-more-button',
  },
]

const clickAll = async (page, buttonSelectors = seeMoreButtons) => {
  for (const buttonSelector of buttonSelectors) {
    const buttons = await page.$$(buttonSelector.selector)
    for (const button of buttons) {
      if (button) {
        await button
          .click()
          .catch((e) =>
            logger.warn(`couldn't click on ${button.selector}, it's probably invisible`)
          )

        await clickAll(page, [ buttonSelector ])
      }
    }
  }
}

module.exports = { clickAll }
