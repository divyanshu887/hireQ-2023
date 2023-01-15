const express = require("express");
const router = express.Router();


const {employeeDetails} = require("../controllers/employee");

router.post("/", employeeDetails);


module.exports = router;