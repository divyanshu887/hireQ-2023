const express = require("express");
const puppeteer = require("puppeteer");
const {
  urlValidation,
  puppeteerConf,
  handleError,
  autoScroll,
} = require("../helpers/utils");

url = "https://www.linkedin.com/in/harsh-mishra-5384b11a0/";
let browser;
console.log("Url is", url);

const f = async () => {
  try {
    browser = await puppeteer.launch(puppeteerConf);

    const page = await browser.newPage();

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

    const waitUntil = ["load", "domcontentloaded"];
    await page.goto(url, { waitUntil: waitUntil });
    await autoScroll(page);
    await page.waitForTimeout(10000);
  } catch (error) {
    console.log(error);
  }
};

f();

const router = express.Router();

router.post("/", async (req, res) => {
  //   const url = urlValidation(req, res);
  url = "https://www.linkedin.com/in/harsh-mishra-5384b11a0/";
  let browser;
  console.log("Url is", url);
  try {
    browser = await puppeteer.launch(puppeteerConf);

    const page = await browser.newPage();

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
      value: this.options.sessionCookieValue,
      domain: ".www.linkedin.com",
    });

    const waitUntil = ["load", "domcontentloaded"];
    await page.goto(url, { waitUntil: waitUntil });

    let aCookies, dCookies;
    await page.waitForTimeout(2 * 1000); // some cookies load lately
    const iCookies = await page.cookies();

    //   check if cookie consent is being asked, also, can if we can deny

    const [cnstAsked, denyConsent] = await page.evaluate(
      (triggerAccept, triggerDeny) => {
        let cnstAsked = false;
        let denyConsent = false; // consent can be denied

        const allBtns = document.querySelectorAll("button");

        allBtns.forEach((btn) => {
          // accept the cookies if consent is not accepted yet

          if (!cnstAsked) {
            for (let i = 0; i < triggerAccept.length; i++) {
              if (btn.innerHTML.includes(triggerAccept[i])) {
                cnstAsked = true;
                btn.click(); // consent accepted
                break; // dont loop through other options
                // check for validity: maybe wrong btn pressed
              }
            }
          }

          // check if user can deny
          if (!denyConsent) {
            for (let i = 0; i < triggerDeny.length; i++) {
              if (btn.innerHTML.includes(triggerDeny[i])) {
                denyConsent = true;
                break; // dont loop through other options
                // check for validity: maybe wrong btn pressed
              }
            }
          }
        });

        return [cnstAsked, denyConsent];
      },
      triggerAccept,
      triggerDeny
    );

    if (cnstAsked) {
      // check further

      await page.reload(); // reload page
      await page.waitForTimeout(2 * 1000); // some cookies load lately
      aCookies = await page.cookies(); // additional cookies after consent accepted
      dCookies = null;

      if (denyConsent) {
        // delete all the cookies, then reload the page
        const client = await page.target().createCDPSession();
        await client.send("Network.clearBrowserCookies");
        await page.reload();

        await page.evaluate((triggerDeny) => {
          let clicked = false;
          const allBtns = document.querySelectorAll("button");

          allBtns.forEach((btn) => {
            // accept the cookies if consent is not accepted yet
            if (!clicked) {
              for (let i = 0; i < triggerDeny.length; i++) {
                if (btn.innerHTML.includes(triggerDeny[i])) {
                  btn.click(); // consent accepted
                  clicked = true;
                  break; // dont loop through other options
                  // check for validity: maybe wrong btn pressed
                }
              }
            }
          });
        }, triggerDeny);

        await page.reload();
        await page.waitForTimeout(2 * 1000); // some cookies load lately
        dCookies = await page.cookies(); // cookies present when consent denied
      }
    } else {
      // since consent hasn't been asked, all the cookies would be same as the initial ones
      aCookies = null;
      dCookies = null;
    }

    await browser?.close();

    const PromiseList = [
      iCookies ? fetchCookiesInfo(iCookies) : null,
      dCookies ? fetchCookiesInfo(dCookies) : null,
      aCookies ? fetchCookiesInfo(aCookies) : null,
    ];

    Promise.all(PromiseList).then((updatedCookiesInfo) => {
      const result = {
        initialCookies: updatedCookiesInfo[0] || cookieSchema,
        consentDeniedCookies: updatedCookiesInfo[1] || cookieSchema,
        consentAcceptedCookies: updatedCookiesInfo[2] || cookieSchema,
        denyConsent: denyConsent,
        consentAsked: cnstAsked,
      };

      res.send({
        status: "success",
        data: result,
      });
    });
  } catch (error) {
    await handleError(error, res, browser);
  }
});

module.exports = router;
