const logger = require('../logger')(__filename)
const wait = require('../wait')
const seeMoreButtons = [
  {
    id: 'SHOW_MORE_ABOUT',
    selector: '#line-clamp-show-more-button',
    textMatch: (text) => RegExp(/visualizar mais/i).test(text)
  },
  {
    id: 'SHOW_MORE_EXPERIENCES',
    selector: '#experience-section .pv-profile-section__see-more-inline',
    textMatch: (text) => RegExp(/exibir mais.*experiências/i).test(text)

  },
  {
    id: 'SEE_MORE_EXPERIENCES',
    selector: '#experience-section .inline-show-more-text__button',
    textMatch: (text) => RegExp(/visualizar mais/i).test(text)

  },
  {
    id: 'SHOW_MORE_CERTIFICATIONS',
    selector: '#certifications-section .pv-profile-section__see-more-inline',
    textMatch: (text) => RegExp(/exibir mais/i).test(text)
  },
  {
    id: 'SHOW_MORE_SKILLS',
    selector: '.pv-skills-section__additional-skills',
    textMatch: (text) => RegExp(/exibir todas as competências de.*/i).test(text)
  }
  // {
  //   id: 'SEE_MORE_RECOMMENDATIONS',
  //   selector: '.recommendations-inlining #line-clamp-show-more-button',
  //   textMatch: () => false
  // },
]

const clickAll = async (page, buttonSelectors = seeMoreButtons, delay = 250) => {
  for (const buttonSelector of buttonSelectors) {
    const buttons = await page.$$(buttonSelector.selector)
    for (const button of buttons) {
      if (button) {
        const innerTextEl = await button.getProperty('innerText')
        const innerText = innerTextEl._remoteObject.value
        const shouldClickAgain =  buttonSelector.textMatch(innerText) 
        if (shouldClickAgain) {
          await button
          .click()
          .catch((e) =>
            logger.warn(`couldn't click on ${button.selector}, it's probably invisible`)
          )
          await clickAll(page, [ buttonSelector ], false)   
        }
      }
    }
  }
  return delay ? wait(delay) : true
}

module.exports = { clickAll }
