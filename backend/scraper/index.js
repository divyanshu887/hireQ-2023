const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const firebase = require("./config/firebase-config");
// const mailer = require("./config/nodemailer-config");

const app = express();

// Bodyparser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// initialize firebase database and service account
firebase.initializeApp();

// const isAuth = require("./middleware/auth").isAuth;

//initialize nodemailer
// mailer.createTransport();

//auth middleware
// app.use(isAuth);

// use routes
app.use("/api/status", require("./routes/status"));
app.use("/api", require("./routes/scraper"));
// app.use("/api/requestMail", require("./routes/mail"));
// app.use("/api", require("./routes/faculty"));
// app.use("/api", require("./routes/recruiters"));

// upload JDs

// app.post("/api/upload", uploadStorage.single("newFile"), (req, res) => {
//   // use modules such as express-fileupload, Multer, Busboy
//   //Omit option to extract all text from the pdf file
//   console.log(req.file);
//   pdfExport
//     .GetTextFromPDF(req.file.path)
//     .then((data) =>
//       res.status(200).json({ result: true, msg: "file uploaded", data })
//     );
// });

// //delete JDs
// app.delete("/api/upload", (req, res) => {
//   console.log(`File deleted`);
//   return res.status(200).json({ result: true, msg: "file deleted" });
// });

//error handler

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(error);
  res.status(status).json({ message: message, data: data });
});

// serve static assets if we are in production
// if (process.env.NODE_ENV === "production") {
//   // set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// } else {
//   app.use(express.static("public"));
// }

const port = process.env.BACKEND_NODE_PORT || 8000;

app.listen(port, () => console.log(`server started on port ${port}`));

// const scrapeByKeyword = async (page, keyword, depth = 1) => {
//   const waitUntil = ["load", "domcontentloaded"];
//   const url = `https://www.linkedin.com/search/results/people/?keywords=%22${keyword}%22%20AND%20%22open%20to%20work%22&origin=SWITCH_SEARCH_VERTICAL&sid=czk`;
//   await page.goto(url, { waitUntil: waitUntil });
//   await autoScroll(page);

//   const links = await page.evaluate(() => {
//     let res = [];
//     const results = document.querySelectorAll(
//       ".reusable-search__result-container .entity-result__title-text.t-16 .app-aware-link"
//     );
//     results.forEach((anchor) => {
//       let link = anchor.href;
//       if (!link.contains("/search/results")) {
//         res.push(link);
//       }
//       return res;
//     });
//   });

//   return links;
// };
