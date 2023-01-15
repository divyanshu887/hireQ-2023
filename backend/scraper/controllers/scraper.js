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

    for (let pg = 0; pg < pages; pg += 1) {
      for (let kw = 0; kw < keywords.length; kw += 1) {
        try {
          const url =
            "https://www.upwork.com/search/profiles/?q=" + keywords[kw];
          const pgData = await scrapeUpWork(page, url);
          await db.ref("employees/").update(pgData);
        } catch (err) {
          console.log(err);
        }
      }
    }

    res.json({ status: "scrapped successfully" });
    await browser.close();
  } catch (err) {
    next(err);
  }
};
