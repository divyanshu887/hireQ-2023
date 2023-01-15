const express = require("express");
const router = express.Router();
const { scrapeKeyword } = require("../controllers/scraper");

router.post("/searchKeyword", scrapeKeyword);

module.exports = router;
