const db = require("../config/firebase-config").getDB();

exports.employeeDetails = async (req, res, next) => {
  console.log(req.body);
  empId = req.body.empId;
  console.log(empId[0]);
  var employeeDetail = {};

  for (index in empId) {
    try {
      const empPromise = await db
        .ref("employees/" + empId[index])
        .once("value");
      const employee = empPromise.val();
      //console.log(employee);

      if (!employee) {
        const error = new Error(
          "Sorry, no employee exist exist with given id"
        );
        error.statusCode = 401;
        return next(error);
      }
      
      employeeDetail[empId[index]] = employee;
      
      
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
  console.log(employeeDetail);
  res.status(200).json(employeeDetail);
};
