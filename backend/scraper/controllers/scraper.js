const puppeteer = require("puppeteer");
const db = require("../config/firebase-config").getDB();
const {
  //   urlValidation,
  puppeteerConf,
  //   handleError,
  //   autoScroll,
  //   getCleanText,
  //   getLocationFromText,
  //   getDurationInDays,
  //   formatDate,
  scrapeByProfile,
  scrapeByKeyword,
} = require("../helpers/utils");

// url = "https://www.linkedin.com/in/harsh-mishra-5384b11a0/";

// console.log("Url is", url);

// const scrapeProfile = async (urls, next) => {
//   // const url = urlValidation(req, res);
//   let browser;

//   browser = await puppeteer.launch(puppeteerConf);

//   const page = await browser.newPage();
//   await page.setDefaultNavigationTimeout(60000); //timeout 60 seconds now

//   // Method to create a faster Page
//   // From: https://github.com/shirshak55/scrapper-tools/blob/master/src/fastPage/index.ts#L113
//   const session = await page.target().createCDPSession();
//   await page.setBypassCSP(true);
//   await session.send("Page.enable");
//   await session.send("Page.setWebLifecycleState", {
//     state: "active",
//   });

//   await page.setCookie({
//     name: "li_at",
//     value:
//       "AQEDAS8PNLwCZ2gdAAABg-kf7zEAAAGF1UlAnE0AANR3HdCWgyVeXgiwZ44TTpzw7utJSdvqgIQ_6Oi1hTKUZ9NtM9bltooWyFf4RvGBfyr305r_q9g0QizeciiWM_5pRRLvXQVlVP6w_2gmTsc7W17H",
//     domain: ".www.linkedin.com",
//   });

//   urls.forEach(async (url) => {
//     try {
//       const userData = await scrapeByProfile(page, url);
//       console.log(userData);
//     } catch (err) {
//       console.log(err);
//     }
//   });

//   // save to db

//   await browser.close();
// };

exports.scrapeKeyword = async (req, res, next) => {
  try {
    const keywords = req.body.keywords;

    let browser;

    browser = await puppeteer.launch(puppeteerConf);

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000); //timeout 60 seconds now

    // Method to create a faster Page
    // From: https://github.com/shirshak55/scrapper-tools/blob/master/src/fastPage/index.ts#L113
    const session = await page.target().createCDPSession();
    await page.setBypassCSP(true);
    await session.send("Page.enable");
    await session.send("Page.setWebLifecycleState", {
      state: "active",
    });

    await page.setCookie({
      name: "li_at",
      value:
        "AQEDAS8PNLwCZ2gdAAABg-kf7zEAAAGF1UlAnE0AANR3HdCWgyVeXgiwZ44TTpzw7utJSdvqgIQ_6Oi1hTKUZ9NtM9bltooWyFf4RvGBfyr305r_q9g0QizeciiWM_5pRRLvXQVlVP6w_2gmTsc7W17H",
      domain: ".www.linkedin.com",
    });

    let links = [];
    let link = await scrapeByKeyword(page, keywords[0], 1);
    links = links.concat(link);

    res.json({ profiles_scraped: links });

    for (let i = 0; i < links.length; i++) {
      try {
        console.log("scraping", links[i]);
        const userData = await scrapeByProfile(page, links[i]);
        const userID = links[i].split("?")[0].split("/")[4];
        await db.ref("employees/" + userID).set(userData);
        console.log("saved to DB", userID);
      } catch (err) {
        console.log(err);
      }
    }

    await browser.close();
  } catch (err) {
    next(err);
  }
};
