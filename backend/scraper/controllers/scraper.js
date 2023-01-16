const puppeteer = require("puppeteer");
const db = require("../config/firebase-config").getDB();
const {
  puppeteerConf,
  scrapeUpWork,
  scrapeByProfile,
  scrapeByKeyword,
} = require("../helpers/utils");

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
      value: process.env.LINKEDIN_SESSION_KEY,
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

exports.scrapeKeywordUpWork = async (req, res, next) => {
  try {
    const keywords = req.body.keywords;
    const pages = req.body.pages;
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

    // https://www.upwork.com/search/profiles/?page=2&q=python
    let scrapeData = []
    for (let pg = 1; pg < pages+1; pg += 1) {
      for (let kw = 0; kw < keywords.length; kw += 1) {
        try {
          const url =
            "https://www.upwork.com/search/profiles/?page="+ pg +"&q=" + keywords[kw];
          const pgData = await scrapeUpWork(page, url);
          scrapeData.push(pgData)
          await db.ref("employees/").update(pgData);
        } catch (err) {
          console.log(err);
        }
      }
    }

    res.json({ status: "scrapped successfully", data: scrapeData });
    await browser.close();
  } catch (err) {
    next(err);
  }
};
