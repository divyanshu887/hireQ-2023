const express = require("express");
const router = express.Router();
const {
  scrapeKeyword,
  scrapeKeywordUpWork,
} = require("../controllers/scraper");

router.post("/searchKeyword", scrapeKeyword);
router.post("/searchKeywordUpWork", scrapeKeywordUpWork);

module.exports = router;
