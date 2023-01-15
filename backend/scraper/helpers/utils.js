const fs = require("fs");
const countries = require("i18n-iso-countries");
const cities = require("all-the-cities");
const moment = require("moment");

const puppeteerConf = {
  headless: false,
  // executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  timeout: 100000,
};

const autoScroll = async (page) => {
  await page?.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const { scrollHeight } = document.body;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
};

const screenshot = async (page, filePath) => {
  await autoScroll(page);
  await page?.screenshot({
    path: filePath,
    fullPage: true,
  });
};

const urlValidation = (req, res) => {
  const { url } = req.body;
  console.log("Url is", url);
  if (!url) {
    res.send({
      status: "error",
      message: "missing input url",
    });
  } else {
    return url;
  }
};

const sendFile = (res, filePath) => {
  res.sendFile(filePath, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    fs.unlink(filePath, function (error) {
      if (error) {
        console.log(error);
        res.send(error);
      }
    });
  });
};

const openPage = async (browser, url) => {
  const page = await browser?.newPage();
  await page?.setViewport({ width: 1200, height: 800 });
  await page?.goto(url, {
    waitUntil: "networkidle0",
  });
  return page;
};

const handleError = async (error, res, browser) => {
  await browser?.close();
  console.log("error is", error);
  res.send({
    status: "error",
    message: error.message || "Internal Server Error",
  });
};

const handleSubError = async (error, browser) => {
  await browser?.close();
  console.log("error is", error);
};

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getCleanText = (text) => {
  const regexRemoveMultipleSpaces = / +/g;
  const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm;

  if (!text) return null;

  const cleanText = text
    .replace(regexRemoveLineBreaks, "")
    .replace(regexRemoveMultipleSpaces, " ")
    .replace("...", "")
    .replace("See more", "")
    .replace("See less", "")
    .trim();

  return cleanText;
};

const getIsCountry = (text) => {
  const countriesList = Object.values(countries.getNames("en"));
  const lowerCaseText = text.toLowerCase();

  // Some custom text that we assume is also a country (lower cased)
  // But is not detected correctly by the iso-countries module
  if (["united states", "the netherlands"].includes(lowerCaseText)) {
    return true;
  }

  return !!countriesList.find(
    (country) => country.toLowerCase() === lowerCaseText
  );
};

const getIsCity = (text) => {
  const lowerCaseText = text.toLowerCase();

  if (["new york"].includes(lowerCaseText)) {
    return true;
  }

  return !!cities.find((city) => city.name.toLowerCase() === lowerCaseText);
};

const formatDate = (date) => {
  if (date === "Present") {
    return moment().format();
  }

  return moment(date, "MMMY").format();
};

const getDurationInDays = (formattedStartDate, formattedEndDate) => {
  if (!formattedStartDate || !formattedEndDate) return null;
  // +1 to include the start date
  return moment(formattedEndDate).diff(moment(formattedStartDate), "days") + 1;
};

const getLocationFromText = (text) => {
  // Text is something like: Amsterdam Oud-West, North Holland Province, Netherlands

  if (!text) return null;

  const cleanText = text.replace(" Area", "").trim();
  const parts = cleanText.split(", ");

  let city = null;
  let province = null;
  let country = null;

  // If there are 3 parts, we can be sure of the order of each part
  // So that must be a: city, province/state and country
  if (parts.length === 3) {
    city = parts[0];
    province = parts[1];
    country = parts[2];

    return {
      city,
      province,
      country,
    };
  }

  // If we only have 2 parts, we don't know exactly what each part is;
  // it could still be: city, province/state or a country
  // For example: Sacramento, California Area
  if (parts.length === 2) {
    // 2 possible scenario's are most likely. We strictly check for the following:
    // first: city + country
    // second: city + province/state

    if (getIsCity(parts[0]) && getIsCountry(parts[1])) {
      return {
        city: parts[0],
        province,
        country: parts[1],
      };
    }

    // If the second part is NOT a country, it's probably a province/state
    if (getIsCity(parts[0]) && !getIsCountry(parts[1])) {
      return {
        city: parts[0],
        province: parts[1],
        country,
      };
    }

    return {
      city,
      province: parts[0],
      country: parts[1],
    };
  }

  // If we only have one part we'll end up here

  // Just find out if it's one of: city, province/state or country
  if (getIsCountry(parts[0])) {
    return {
      city,
      province,
      country: parts[0],
    };
  }

  if (getIsCity(parts[0])) {
    return {
      city: parts[0],
      province,
      country,
    };
  }

  // Else, it must be a province/state. We just don't know and assume it is.
  return {
    city,
    province: parts[0],
    country,
  };
};

const scrapeByProfile = async (page, url) => {
  const waitUntil = ["load", "domcontentloaded"];
  await page.goto(url, { waitUntil: waitUntil });
  await autoScroll(page);

  // user data
  await page.waitForSelector(".pv-top-card");

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

  // user data
  await page.waitForSelector("#experience");

  const rawUserExperience = await page.evaluate(() => {
    let userExp = document.querySelector("#experience");
    console.log(userExp);
    let userExpData = [];
    if (
      userExp != null &&
      userExp.parentElement != null &&
      userExp.parentElement.querySelector("ul") != null
    ) {
      workExp = userExp.parentElement.querySelector("ul").children;
      for (let i = 0; i < workExp.length; i++) {
        let jobTitle = "";
        let employer = "";
        let employmentType = "";
        let jobYear = "";
        let jobDuration = "";
        let jobLocation = "";
        let startDate, endDate, endDateIsPresent;
        try {
          jobTitle = workExp[i]
            .querySelector(".display-flex.align-items-center")
            .innerText.split("\n")[0];
          // employer and employee type
          console.log(jobTitle);
        } catch (err) {
          console.log(err);
        }

        try {
          employer = workExp[i]
            .querySelector(".t-14.t-normal")
            .innerText.split("\n")[0]
            .split("·")[0];
          console.log(employer);
        } catch (err) {
          console.log(err);
        }

        try {
          employmentType =
            workExp[i]
              .querySelector(".t-14.t-normal")
              .innerText.split("\n")[0]
              .split("·")[1] || null;
          console.log(employmentType);
        } catch (err) {
          console.log(err);
        }

        try {
          jobYear = workExp[i]
            .querySelectorAll(".t-14.t-normal.t-black--light")[0]
            .innerText.split("\n")[0]
            .split("·")[0];

          const startDatePart = jobYear?.split("–")[0] || null;
          startDate = startDatePart?.trim() || null;

          const endDatePart = jobYear?.split("–")[1] || null;
          endDateIsPresent =
            endDatePart?.trim().toLowerCase() === "present" || false;
          endDate =
            endDatePart && !endDateIsPresent ? endDatePart.trim() : "Present";
          console.log(jobYear);
        } catch (err) {
          console.log(err);
        }

        try {
          jobDuration = workExp[i]
            .querySelectorAll(".t-14.t-normal.t-black--light")[0]
            .innerText.split("\n")[0]
            .split("·")[1];
          console.log(jobDuration);
        } catch (err) {
          console.log(err);
        }

        try {
          jobLocation = workExp[i]
            .querySelectorAll(".t-14.t-normal.t-black--light")[1]
            .innerText.split("\n")[0];
          console.log(jobLocation);
        } catch (err) {
          console.log(err);
        }

        userExpData.push({
          jobTitle,
          employer,
          employmentType,
          jobYear,
          startDate,
          endDate,
          endDateIsPresent,
          jobDuration,
          jobLocation,
        });
      }
      console.log(userExpData);
      return userExpData;
    }
  });

  const experiences = rawUserExperience.map((rawExperience) => {
    const startDate = formatDate(rawExperience.startDate);
    const endDate = formatDate(rawExperience.endDate) || null;

    const durationInDaysWithEndDate =
      startDate && endDate && !rawExperience.endDateIsPresent
        ? getDurationInDays(startDate, endDate)
        : null;
    const durationInDaysForPresentDate =
      rawExperience.endDateIsPresent && startDate
        ? getDurationInDays(startDate, new Date())
        : null;
    const durationInDays = rawExperience.endDateIsPresent
      ? durationInDaysForPresentDate
      : durationInDaysWithEndDate;

    return {
      ...rawExperience,
      jobTitle: getCleanText(rawExperience.jobTitle),
      employer: getCleanText(rawExperience.employer),
      employmentType: getCleanText(rawExperience.employmentType),
      jobLocation: rawExperience?.jobLocation
        ? getLocationFromText(rawExperience.jobLocation)
        : null,
      startDate,
      endDate,

      durationInDays,
      // description: getCleanText(rawExperience.description)
    };
  });

  const rawUserEducation = await page.evaluate(() => {
    let userEdu = document.querySelector("#education");
    let userEduData = [];
    if (
      userEdu != null &&
      userEdu.parentElement != null &&
      userEdu.parentElement.querySelector("ul") != null
    ) {
      workEdu = userEdu.parentElement.querySelector("ul").children;
      for (let i = 0; i < workEdu.length; i++) {
        let collegeName = "";
        let degreeName = "";
        let fieldOfStudy = "";
        let startDate = "";
        let endDate = "";

        try {
          collegeName = workEdu[i]
            .querySelector(".mr1.hoverable-link-text.t-bold")
            .innerText.split("\n")[0];
          console.log(collegeName);
        } catch (err) {
          console.log(err);
        }

        try {
          degreeName = workEdu[i]
            .querySelector(".t-14.t-normal")
            .innerText.split("\n")[0]
            .split("-")[0];
          console.log(degreeName);
        } catch (err) {
          console.log(err);
        }

        try {
          fieldOfStudy = workEdu[i]
            .querySelector(".t-14.t-normal")
            .innerText.split("\n")[0]
            .split("-")[1];
          console.log(fieldOfStudy);
        } catch (err) {
          console.log(err);
        }

        try {
          startDate = workEdu[i]
            .querySelectorAll(".t-14.t-normal.t-black--light")[0]
            .innerText.split("\n")[0]
            .split("-")[0];
          console.log(startDate);
        } catch (err) {
          console.log(err);
        }

        try {
          endDate = workEdu[i]
            .querySelectorAll(".t-14.t-normal.t-black--light")[0]
            .innerText.split("\n")[0]
            .split("-")[0];
          console.log(endDate);
        } catch (err) {
          console.log(err);
        }

        userEduData.push({
          collegeName,
          degreeName,
          fieldOfStudy,
          startDate,
          endDate,
        });
      }
      console.log(userEduData);
      return userEduData;
    }
  });

  console.log(rawUserEducation);
  // extract contact-info
  await page.waitForSelector("a#top-card-text-details-contact-info"); // <-- wait until it exists
  await page.click("a#top-card-text-details-contact-info");

  await page.waitForSelector(".pv-profile-section__section-info.section-info"); // <-- wait until it exists

  const contactInfo = await page.evaluate(() => {
    const parentElement = document.querySelector(
      ".pv-profile-section__section-info.section-info"
    ).children;
    let data = {};
    for (let i = 0; i < parentElement.length; i++) {
      let childClass = parentElement[i].classList[1];
      if (childClass) {
        data[childClass.split("-")[1]] = parentElement[i].children[2].innerText;
      }
    }
    return data;
  });

  // close the modal
  await page.waitForSelector("button[aria-label='Dismiss']"); // <-- wait until it exists
  await page.click("button[aria-label='Dismiss']");

  let skills = [];
  try {
    // extract skills
    // document.querySelector("#skills").parentElement.children[2].children[1].children[0].children[0].click()

    // await page.goto(url + "/details/skills/", { waitUntil: waitUntil });
    await page.waitForSelector("#skills"); // <-- wait until it exists

    skills = await page.evaluate(() => {
      // click to expand
      document
        .querySelector("#skills")
        .parentElement.children[2].children[1].children[0].children[0].click();

      let temp = new Set();
      const skillDiv = document.querySelectorAll(
        ".mr1.hoverable-link-text.t-bold"
      );

      for (let i = 0; i < skillDiv.length; i++) {
        let skill = skillDiv[i].children[1].innerText;

        if (skill !== undefined) {
          temp.add(skill);
        }
      }

      return Array.from(temp);
    });
  } catch (err) {
    console.log(err);
  }

  const userData = {
    profileData: userProfile,
    userExperience: experiences,
    userEducation: rawUserEducation,
    contactInfo,
    skills: skills,
    source: "linkedin",
  };

  return userData;
};

const scrapeByKeyword = async (page, keyword, depth = 1) => {
  const waitUntil = ["load", "domcontentloaded"];
  const url = `https://www.linkedin.com/search/results/people/?keywords=%22${keyword}%22%20AND%20%22open%20to%20work%22&origin=SWITCH_SEARCH_VERTICAL&sid=czk`;
  await page.goto(url, { waitUntil: waitUntil });

  await page.waitForSelector(
    ".reusable-search__result-container .entity-result__title-text.t-16 .app-aware-link"
  ); // <-- wait until it exists
  const links = await page.evaluate(() => {
    let res = [];
    const results = document.querySelectorAll(
      ".reusable-search__result-container .entity-result__title-text.t-16 .app-aware-link"
    );

    for (let i = 0; i < results.length; i++) {
      console.log(results[i].href);
      if (!results[i].href.includes("/search/results")) {
        res.push(results[i].href);
      }
    }
    return res;
  });
  console.log(links);
  // await autoScroll(page);

  return links;
};

const scrapeUpWork = async (page, url) => {
  const waitUntil = ["load", "domcontentloaded"];

  await page.goto(url, { waitUntil: waitUntil });

  await page.waitForSelector(".up-card-section.up-card-hover");
  const userData = await page.evaluate(() => {
    let data = {};
    const parentDiv = document.querySelectorAll(
      ".up-card-section.up-card-hover"
    );

    for (let el = 0; el < parentDiv.length; el += 1) {
      const id = parentDiv[el].attributes["data-test-key"].value.replace(
        "null",
        ""
      );
      const fullname = parentDiv[el].querySelector(".identity-name").innerText;
      const title = parentDiv[el].querySelector(
        ".my-0.freelancer-title"
      ).innerText;
      const location = parentDiv[el].querySelector(
        "span[itemprop='country-name']"
      ).innerText;
      const description = parentDiv[el].querySelector(
        ".up-line-clamp-v2.clamped"
      ).innerText;
      const profileImage = parentDiv[el].querySelector("img").href;
      const skills = [];
      const skilldiv =
        parentDiv[el].querySelector(".up-skill-wrapper").children;

      for (let sk = 0; sk < skilldiv.length; sk += 1) {
        skills.push(skilldiv[sk].innerText);
      }
      data[id] = {
        fullname,
        title,
        location,
        description,
        profileImage,
        skills,
        source: "upwork",
        url: "https://www.upwork.com/freelancers/" + id,
      };
    }

    return data;
  });

  console.log(userData);
  return userData;
};

module.exports = {
  puppeteerConf,
  autoScroll,
  screenshot,
  urlValidation,
  sendFile,
  openPage,
  handleError,
  handleSubError,
  randomString,
  getCleanText,
  getLocationFromText,
  getDurationInDays,
  formatDate,
  scrapeByProfile,
  scrapeByKeyword,
  scrapeUpWork,
};
