const scrapedin = require('./src/scrapedin')
const util = require('util')

const run = async () => {
  console.info(`Starting test ${new Date()}`)
  
  const profileScraper = await scrapedin({ email: '<your user>', password: '<your password>' })
  const profile = await profileScraper('<profile url>')

  console.log(util.inspect(profile, false, null, true /* enable colors */))
  console.info(`Finished ${new Date()}`)
  process.exit(0)
}

run()
