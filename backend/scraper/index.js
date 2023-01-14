const puppeteer = require("puppeteer");
const {
  urlValidation,
  puppeteerConf,
  handleError,
  autoScroll,
  getCleanText,
} = require("./helpers/utils");

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

    // user data

    const rawUserProfileData = await page.evaluate(() => {
      const profileSection = document.querySelector(".pv-top-card");

      const url = window.location.href;

      //ok
      const fullNameElement = profileSection?.querySelector(
        ".pv-text-details__left-panel > div"
      );
      const fullName = fullNameElement?.textContent || null;

      const titleElement = profileSection?.querySelector("h2");
      const title = titleElement?.textContent || null;

      //ok
      const locationElement = profileSection?.querySelector(
        ".pv-text-details__left-panel.mt2"
      );
      const location = locationElement?.textContent || null;

      //ok
      const photoElement =
        profileSection?.querySelector(".pv-top-card-profile-picture__image") ||
        profileSection?.querySelector(".profile-photo-edit__preview");
      const photo = photoElement?.getAttribute("src") || null;

      const descriptionElement = document.querySelector(
        ".pv-shared-text-with-see-more.full-width.t-14.t-normal.t-black.display-flex.align-items-center"
      ); // Is outside "profileSection"
      const description = descriptionElement?.textContent || null;

      return {
        fullName,
        title,
        location,
        photo,
        description,
        url,
      };
    });

    const userProfile = {
      ...rawUserProfileData,
      fullName: getCleanText(rawUserProfileData.fullName),
      title: getCleanText(rawUserProfileData.title),
      location: rawUserProfileData.location
        ? getLocationFromText(rawUserProfileData.location)
        : null,
      description: getCleanText(rawUserProfileData.description),
    };

    console.log(userProfile);

    await page.waitForTimeout(10000);
  } catch (error) {
    console.log(error);
  }
};

f();
