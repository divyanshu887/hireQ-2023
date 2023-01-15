const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

const { uploadJD, deleteJD } = require("../controllers/recruiters");

router.post("/upload", uploadStorage.single("newFile"), uploadJD);
router.delete("/upload/:name", deleteJD);

module.exports = router;
