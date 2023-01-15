const puppeteer = require('puppeteer');
const {
  urlValidation,
  puppeteerConf,
  handleError,
  autoScroll,
  getCleanText,
  getLocationFromText
} = require('./helpers/utils');

url = 'https://www.linkedin.com/in/harsh-mishra-5384b11a0/';
let browser;
console.log('Url is', url);

const f = async () => {
  try {
    browser = await puppeteer.launch(puppeteerConf);

    const page = await browser.newPage();

    // Method to create a faster Page
    // From: https://github.com/shirshak55/scrapper-tools/blob/master/src/fastPage/index.ts#L113
    const session = await page.target().createCDPSession();
    await page.setBypassCSP(true);
    await session.send('Page.enable');
    await session.send('Page.setWebLifecycleState', {
      state: 'active',
    });

    await page.setCookie({
      name: 'li_at',
      value:
        'AQEDAS8PNLwCZ2gdAAABg-kf7zEAAAGF1UlAnE0AANR3HdCWgyVeXgiwZ44TTpzw7utJSdvqgIQ_6Oi1hTKUZ9NtM9bltooWyFf4RvGBfyr305r_q9g0QizeciiWM_5pRRLvXQVlVP6w_2gmTsc7W17H',
      domain: '.www.linkedin.com',
    });

    const waitUntil = ['load', 'domcontentloaded'];
    await page.goto(url, { waitUntil: waitUntil });
    await autoScroll(page);

    // user data
    await page.waitForSelector('.pv-top-card');

    const rawUserProfileData = await page.evaluate(() => {
      const profileSection = document.querySelector('.pv-top-card');

      const url = window.location.href;

      //ok
      const fullNameElement = profileSection?.querySelector(
        '.pv-text-details__left-panel > div'
      );
      const fullName = fullNameElement?.textContent || null;

      const titleElement = profileSection?.querySelector('h2');
      const title = titleElement?.textContent || null;

      //ok
      const locationElement = profileSection?.querySelector(
        '.pv-text-details__left-panel.mt2'
      );
      const location = locationElement?.textContent || null;

      //ok
      const photoElement =
        profileSection?.querySelector('.pv-top-card-profile-picture__image') ||
        profileSection?.querySelector('.profile-photo-edit__preview');
      const photo = photoElement?.getAttribute('src') || null;

      const descriptionElement = document.querySelector(
        '.pv-shared-text-with-see-more.full-width.t-14.t-normal.t-black.display-flex.align-items-center'
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

    // user data
    await page.waitForSelector('#experience');

    const rawUserExperience = await page.evaluate(() => {
      let userExp = document.querySelector('#experience');
      console.log(userExp);
      let userExpData = [];
      if (
        userExp != null &&
        userExp.parentElement != null &&
        userExp.parentElement.querySelector('ul') != null
      ) {
        workExp = userExp.parentElement.querySelector('ul').children;
        for (let i = 0; i < workExp.length; i++) {
          let jobTitle = '';
          let employer = '';
          let employmentType = '';
          let jobYear = '';
          let jobDuration = '';
          let jobLocation = '';
          try {
            jobTitle = workExp[i]
              .querySelector('.display-flex.align-items-center')
              .innerText.split('\n')[0];
            // employer and employee type
            console.log(jobTitle);
          } catch (err) {
            console.log(err);
          }

          try {
            employer = workExp[i]
              .querySelector('.t-14.t-normal')
              .innerText.split('\n')[0]
              .split('·')[0];
            console.log(employer);
          } catch (err) {
            console.log(err);
          }

          try {
            employmentType =
              workExp[i]
                .querySelector('.t-14.t-normal')
                .innerText.split('\n')[0]
                .split('·')[1] || null;
            console.log(employmentType);
          } catch (err) {
            console.log(err);
          }

          try {
            jobYear = workExp[i]
              .querySelectorAll('.t-14.t-normal.t-black--light')[0]
              .innerText.split('\n')[0]
              .split('·')[0];
            console.log(jobYear);
          } catch (err) {
            console.log(err);
          }

          try {
            jobDuration = workExp[i]
              .querySelectorAll('.t-14.t-normal.t-black--light')[0]
              .innerText.split('\n')[0]
              .split('·')[1];
            console.log(jobDuration);
          } catch (err) {
            console.log(err);
          }

          try {
            jobLocation = workExp[i]
              .querySelectorAll('.t-14.t-normal.t-black--light')[1]
              .innerText.split('\n')[0];
            console.log(jobLocation);
          } catch (err) {
            console.log(err);
          }

          userExpData.push({
            jobTitle,
            employer,
            employmentType,
            jobYear,
            jobDuration,
            jobLocation,
          });
        }
        console.log(userExpData)
        return userExpData;
      }
    });

    const rawUserEducation = await page.evaluate(() => {
      let userEdu = document.querySelector('#education');
      let userEduData = [];
      if (
        userEdu != null &&
        userEdu.parentElement != null &&
        userEdu.parentElement.querySelector('ul') != null
      ) {
        workEdu = userEdu.parentElement.querySelector('ul').children;
        for (let i = 0; i < workEdu.length; i++) {
          let collegeName = '';
          let degreeName = '';
          let fieldOfStudy = '';
          let startDate = '';
          let endDate = '';

          try {
            collegeName = workEdu[i]
              .querySelector('.mr1.hoverable-link-text.t-bold')
              .innerText.split('\n')[0];
            console.log(collegeName);
          } catch (err) {
            console.log(err);
          }

          try {
            degreeName = workEdu[i]
              .querySelector('.t-14.t-normal')
              .innerText.split('\n')[0]
              .split('-')[0];
            console.log(degreeName);
          } catch (err) {
            console.log(err);
          }

          try {
            fieldOfStudy = workEdu[i]
              .querySelector('.t-14.t-normal')
              .innerText.split('\n')[0]
              .split('-')[1];
            console.log(fieldOfStudy);
          } catch (err) {
            console.log(err);
          }

          try {
            startDate = workEdu[i]
              .querySelectorAll('.t-14.t-normal.t-black--light')[0]
              .innerText.split('\n')[0]
              .split('-')[0];
            console.log(startDate);
          } catch (err) {
            console.log(err);
          }

          try {
            endDate = workEdu[i]
              .querySelectorAll('.t-14.t-normal.t-black--light')[0]
              .innerText.split('\n')[0]
              .split('-')[0];
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
        console.log(userEduData)
        return userEduData;
      }
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

    // extract contact-info
    await page.waitForSelector('a#top-card-text-details-contact-info'); // <-- wait until it exists
    await page.click('a#top-card-text-details-contact-info');

    await page.waitForSelector(
      '.pv-profile-section__section-info.section-info'
    ); // <-- wait until it exists

    const contactInfo = await page.evaluate(() => {
      const parentElement = document.querySelector(
        '.pv-profile-section__section-info.section-info'
      ).children;
      let data = {};
      for (let i = 0; i < parentElement.length; i++) {
        let childClass = parentElement[i].classList[1];
        if (childClass) {
          data[childClass.split('-')[1]] =
            parentElement[i].children[2].innerText;
        }
      }
      return data;
    });

    console.log(contactInfo);

    await page.waitForTimeout(10000);
  } catch (error) {
    console.log(error);
  }
};

f();
