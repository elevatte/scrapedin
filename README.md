![](https://github.com/@elevatte/scrapedin/scrapedin/raw/master/logo.png)
----
Scraper for LinkedIn full profile data. Unlike others scrapers, it's working in 2020 with their new website.

`npm i @elevatte/scrapedin`

### Usage Example:

```javascript
const scrapedin = require('@elevatte/scrapedin')

const profileScraper = await scrapedin({ email: 'login@mail.com', password: 'pass' })
const profile = await profileScraper('https://www.linkedin.com/in/some-profile/')
```

### Start Guide:

- [Basic Tutorial](https://github.com/@elevatte/scrapedin/scrapedin/wiki/Basic-Tutorial)
- [Using Cookies to Login](https://github.com/@elevatte/scrapedin/scrapedin/wiki/Using-Cookies-To-Login)
- [Tips](https://github.com/@elevatte/scrapedin/scrapedin/wiki/Tips)
- [Documentation](https://github.com/@elevatte/scrapedin/scrapedin/wiki/Documentation)


### Contribution

Feel free to contribute. Just open an issue to discuss something before creating a PR.

### License

[Apache 2.0][apache-license]

[apache-license]:./LICENSE
