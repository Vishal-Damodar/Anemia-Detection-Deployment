const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/checkAuth");
const { ensureUser } = require("../controllers/userController");
const { getRegistrationStatistics } = require("../controllers/ashaController");
const { fetchTestResultsByTester } = require("../controllers/ashaController");
const ashaController = require("../controllers/ashaController");
const userController = require("../controllers/userController");
const { getPatients } = require("../controllers/doctorController");
const upload = require("../server");
const Patient = require("../models/Patient");
const { session } = require("passport");
const jwt = require("jsonwebtoken");
const JWT_KEY = "jwtactivekey987";
//------------ Welcome Route ------------//s
router.get("/", (req, res) => {
  res.send("welcome");
});

//------------ Dashboard Route ------------//
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.json({
    dash: {
      name: req.user.name,
    },
  })
);

// router.get("/user_result", (req, res) => {
//   const aadhar = req.query.aadhar; // Retrieve the Aadhar number from the query parameters
//   res.render("user_result", { aadhar }); // Pass the Aadhar number to the 'user_result' view
// });

router.get("/user_result", userController.getUserResult);

router.get('/asha_login', ensureAuthenticated, async (req, res) => {
  try {
    //  const loggedInUser = req.user; // Access the logged-in user's information from req.user
    //  const token = jwt.sign(
    //    { loggedInUser },
    //    JWT_KEY,
    //    { expiresIn: "30m" },
    //);
      //console.log("logi ",token);
      //const registrationStatistics = await getRegistrationStatistics(loggedInUser.email); // Fetch registration statistics
      //res.json({ user: loggedInUser, registrationStatistics ,token}); // Render asha_login page with user info and statistics
  } catch (error) {
      console.error('Error rendering asha_login:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.post(
  "/asha_login/view_patients",
  ensureAuthenticated,
  async (req, res) => { 
    try {
      const loggedInUser = req.user;
      // Call the fetchTestResultsByTester function to fetch data
      const testResults = await fetchTestResultsByTester(loggedInUser.email);

      // Send the fetched data to the frontend as JSON
      res.json({ user: loggedInUser.email, testResults });
    } catch (error) {
      console.error("Error rendering asha_login:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/asha_login/view_patients/:id",
  ensureAuthenticated,
  async (req, res) => {
    try {
      const aadhar = req.params.id;

      const patient = await Patient.findOne({ aadhar });
      console.log(aadhar);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post(
  "/asha_login",
  upload.fields([
    { name: "nailImageData", maxCount: 1 },
  ]),
  ashaController.registerHandle
);

router.post(
  "/take_test",
  upload.fields([
    { name: "nailImageData", maxCount: 1 },
  ]),
  userController.register
);

router.get("/doctor_login", ensureAuthenticated, async (req, res) => {
  try {
    //   const loggedInUser = req.user;
    //   const token = jwt.sign(
    //     { loggedInUser },
    //     JWT_KEY,
    //     { expiresIn: "30m" },
    // );
      console.log("entered");
       filter = req.query.filter;
       const viewPatients = await getPatients(filter);
       res.json(viewPatients ); // Render asha_login page with user info and statistics
    //   console.log(viewPatients);
  } catch (error) {
      console.error("Error rendering asha_login:", error);
      res.status(500).send("Internal Server Error");
  }
});


//router.post("/get-phone-number", userController.getPhoneNumber);
router.post(
  "/get-phone-number",
  async (req, res) => {
    try {
      console.log('Request received:', req.body);
      const { aadhar } = req.body;
      const patient = await Patient.findOne({ aadhar });
  
      if (patient) {
        res.json({ phoneNumber: patient.phone });
      } else {
        res.status(404).json({ message: 'Aadhar number not found' });
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.get("/test_result", async (req, res) => {
  try {
      const aadhar = req.query.aadhar;
      console.log("AADHAR: ", aadhar);
      const patient = await Patient.findOne({ aadhar });

      if (!patient) {
          return res.json({ user_result: { error: "Patient not found" } });
      }
      patient.testResults.sort((a, b) => b.testDate - a.testDate);
      const firstTestResult = patient.testResults[0];
        // Send the first test result in the response
      res.json({ user_result: { testResult: firstTestResult } });
  } catch (err) {
      console.error(err);
      res.json({
          user_result: {
              error: "An error occurred. Please try again later.",
          },
      });
  }
});

router.get("/successReset", (req, res) => res.send("successReset"));


module.exports = router;
