const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const firebase = require("./config/firebase-config");
const mailer = require("./config/nodemailer-config");

const app = express();

// Bodyparser middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// initialize firebase database and service account
firebase.initializeApp();

const isAuth = require("./middleware/auth").isAuth;

//initialize nodemailer
mailer.createTransport();

//auth middleware
app.use(isAuth);

// use routes
app.use("/api/status", require("./routes/status"));
app.use("/api/requestMail", require("./routes/mail"));
app.use("/api", require("./routes/faculty"));

// upload JDs

app.post("/api/upload", (req, res) => {
  // use modules such as express-fileupload, Multer, Busboy
  
  setTimeout(() => {
      console.log('file uploaded')
      return res.status(200).json({ result: true, msg: 'file uploaded' });
  }, 3000);
});

//delete JDs
app.delete("/api/upload", (req, res) => {
  console.log(`File deleted`)
  return res.status(200).json({ result: true, msg: 'file deleted' });
});


//error handler

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
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

const port = process.env.BACKEND_NODE_PORT || 5000;

app.listen(port, () => console.log(`server started on port ${port}`));
