const express = require("express");
const router = express.Router();
const smtp = require("../config/nodemailer-config").getSMTP();

router.post("/", (req, res, next) => {
  // setup e-mail data with unicode symbols
  console.log(req.body);

  var mailOptions = {
    from: process.env.MAIL_USERNAME, // sender address
    to: req.body.userMail, // list of receivers
    subject: "Congrats !! Your profile has been shortlisted", // Subject line
    html:
      `Hello,` +
      `</b>Congrats, your profile has been shortlisted for hireQuotient.` +
      `</b></b> This is system generated email, please do not reply to this email`, // plaintext body
    //html: "<b>Hello world ✔</b>", // html body
  };

  // send mail with defined transport object
  smtp.sendMail(mailOptions, function (err, response) {
    if (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    } else {
      console.log("Email sent ");
      res.status(200).json({ message: "Email Sent successfully" });
    }
  });
});

module.exports = router;
