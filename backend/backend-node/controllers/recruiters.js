const db = require("../config/firebase-config").getDB();
const fs = require("fs");
const path = require("path");
const pdfExport = require("../helpers/pdfExports");

exports.getJD = async (req, res, next) => {
  try {
    const prevJDpromise = await db
      .ref("recruiters/" + req.useralias)
      .once("value");
    const prevJD = prevJDpromise.val();
    res.json({ data: prevJD });
  } catch (err) {
    next(err);
  }
};

exports.uploadJD = async (req, res, next) => {
  try {
    const data = await pdfExport.GetTextFromPDF(req.file.path);
    const parsedData = [];
    data.forEach((element) => {
      if (element === "") {
        parsedData.push("\n");
      } else {
        parsedData.push(element);
      }
    });

    const save = {
      description: parsedData.join(""),
      path: req.file.path,
    };

    // save to db
    await db
      .ref(
        "recruiters/" + req.useralias + "/" + req.file.filename.split(".")[0]
      )
      .set(save);
    return res.status(200).json({
      result: true,
      msg: "file uploaded",
      filename: req.file.filename,
      description: save.description,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteJD = async (req, res, next) => {
  try {
    console.log(req.params, "HI");
    console.log(req.params["name"]);
    fs.unlinkSync(path.join(__dirname, "..", "uploads", req.params["name"]));
    // remove from db
    await db
      .ref(
        "recruiters/" + req.useralias + "/" + req.params["name"].split(".")[0]
      )
      .remove();

    return res.status(200).json({
      result: true,
      msg: "file successfully deleted",
      filename: req.params["name"],
    });
  } catch (error) {
    next(error);
  }
};
