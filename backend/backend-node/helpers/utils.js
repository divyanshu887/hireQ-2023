const fs = require("fs");

const puppeteerConf = {
  headless: false,
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
};

const moment = require("moment");
const weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

exports.formatSlot = (startTime, endTime) => {
  let momStart = moment(Number(startTime));
  let start_time = momStart.format("hh:mm");
  let momEnd = moment(Number(endTime));
  let end_time = momEnd.format("hh:mm");

  newSlot = {
    date: momStart.format("YYYY-MM-DD"),
    dtcode: weekday[momStart.day()] + "-" + start_time,
    time: start_time + "-" + end_time,
  };
  return newSlot;
};

exports.parseCourseDetails = (faculty, courses) => {
  // let generalclass = {};
  // weekday.forEach((item)=>{
  //   generalclass[item.charAt(0).toUpperCase() + item.slice(1)] = [];
  // })

  let ret = {
    courseOffering: [],
    generalclass: {
      Sun: [],
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
    },
    extraclass: [],
    cancelledSlots: {},
  };

  // courses offered
  for (let i = 0; i < faculty.courses_offering.length; i++) {
    let class_obj = courses[faculty.courses_offering[i]];
    ret.courseOffering.push({
      course_code: faculty.courses_offering[i],
      course_name: class_obj["course_name"],
    });

    for (let q = 0; q < class_obj["general_slots"].length; q++) {
      let coursetmp = class_obj["general_slots"][q];
      coursetmp.course_code = faculty.courses_offering[i];
      coursetmp.course_name = class_obj["course_name"];

      ret.generalclass[coursetmp.day.slice(0, 3)].push(coursetmp);
    }

    // extraclass

    for (let j = 0; j < class_obj.booked_slots.length; j++) {
      let ecOb = class_obj.booked_slots[j];

      let start = new Date(ecOb.date + " " + ecOb.time.split("-")[0]);
      let end = new Date(ecOb.date + " " + ecOb.time.split("-")[0]);

      if (start.getHours() < 8) {
        start = start.setHours(start.getHours() + 12);
      } else {
        start = start.getTime();
      }

      if (end.getHours() <= 8) {
        end = end.setHours(end.getHours() + 12);
      } else {
        end.getTime();
      }

      ret.extraclass.push({
        course_code: faculty.courses_offering[i],
        course_name: class_obj["course_name"],
        end: end,
        start: start,
        id: String(start) + faculty.courses_offering[i] + String(end),
        startWeek: moment(start).week(),
        endWeek: moment(end).week(),
      });
    }

    //cancelled
    for (let j = 0; j < class_obj.cancelled_slots.length; j++) {
      let ecOb = class_obj.cancelled_slots[j];

      let start = new Date(ecOb.date + " " + ecOb.time.split("-")[0]);

      if (start.getHours() < 8) {
        start = start.setHours(start.getHours() + 12);
      } else {
        start = start.getTime();
      }

      ret.cancelledSlots[String(start) + faculty.courses_offering[i]] =
        class_obj["course_name"];
    }
  }
  return ret;
};

exports.parseTimetable = (faculty, courses, courseID) => {
  let ret = { student_alloted_courses: {}, courses_offering: {} };

  for (let i = 0; i < faculty.courses_offering.length; i++) {
    ret.courses_offering[faculty.courses_offering[i]] =
      courses[faculty.courses_offering[i]];
  }
  if (faculty.student_alloted_courses[courseID]) {
    for (const [key, value] of Object.entries(
      faculty.student_alloted_courses[courseID]
    )) {
      let course = courses[key];

      course.student_count = value;
      ret.student_alloted_courses[key] = course;
    }
  }
  return ret;
};

exports.parseClass = (facultyDetails, courseDetails, subCode) => {
  let generalClass = {};
  let bookedClass = {};
  weekday.forEach((day) => {
    generalClass[day] = {};
    bookedClass[day] = {};
  });

  const course_offered = Object.keys(facultyDetails.student_alloted_courses);

  for (const [key, value] of Object.entries(
    facultyDetails.student_alloted_courses[subCode]
  )) {
    if (key in course_offered) continue;

    let course = courseDetails[key];

    course.general_slots.forEach((slot) => {
      let dtcode = slot.dtcode;
      let dayCode = dtcode.substring(0, 3);

      if (!(dtcode in generalClass[dayCode])) {
        generalClass[dayCode][dtcode] = {
          day: slot.day,
          dtcode: dtcode,
          time: slot.time,
          clash_counts: 0,
          courses_details: {},
        };
      }

      generalClass[dayCode][dtcode].clash_counts += value;
      generalClass[dayCode][dtcode].courses_details[key] = {
        instructor_mail: course.instructor_mail,
        course_name: course.course_name,
        short_code: course.short_code,
        clashing_students: value,
      };
    });

    if (
      Object.prototype.toString.call(course.booked_slots) === "[object Array]"
    ) {
      course.booked_slots.forEach((slot) => {
        let dtcode = slot.dtcode;
        let dayCode = dtcode.substring(0, 3);

        if (!(dtcode in bookedClass[dayCode])) {
          bookedClass[dayCode][dtcode] = {
            date: slot.date,
            dtcode: dtcode,
            time: slot.time,
            clash_counts: 0,
            courses_details: {},
          };
        }

        bookedClass[dayCode][dtcode].clash_counts += value;
        bookedClass[dayCode][dtcode].courses_details[key] = {
          instructor_mail: course.instructor_mail,
          course_name: course.course_name,
          short_code: course.short_code,
          clashing_students: value,
        };
      });
    }
  }

  return [generalClass, bookedClass];
};

exports.cancelClass = (facultyDetails, courseDetails, subCode) => {
  let ret = {};
  weekday.forEach((day) => (ret[day] = {}));

  const course_offered = Object.keys(facultyDetails.student_alloted_courses);

  for (const [key, value] of Object.entries(
    facultyDetails.student_alloted_courses[subCode]
  )) {
    if (key in course_offered) continue;

    let course = courseDetails[key];

    for (let idx = 0; idx < course.cancelled_slots.length; idx++) {
      let slot = course.cancelled_slots[idx];
      let dtcode = slot.dtcode;
      let dayCode = dtcode.substring(0, 3);

      let start = new Date(slot.date + " " + slot.time.split("-")[0]);

      if (start.getHours() < 8) {
        start = start.setHours(start.getHours() + 12);
      } else {
        start = start.getTime();
      }

      ret[dayCode][String(start) + key] = value;
    }
  }

  return ret;
};
