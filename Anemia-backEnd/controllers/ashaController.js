const Patient = require("../models/Patient");
const fs = require("fs");
const { processImage } = require("../pythonModel/imageProcessor");
const { json } = require("express");
async function registerHandle(req, res) {
  console.log("Entered registerHandle");
  // console.log(req.body);
  console.log("files", req.files);

  // Access uploaded images from req.files object
  const nailImageData = req.files["nailImageData"][0]; // Single image

  const { ashaEmail, name, gender, aadhar, phone, city, state } = req.body;
  let errors = [];

  // Checking required fields
  if (!name || !gender || !aadhar || !phone || !city || !state || !ashaEmail) {
    errors.push({ msg: "Please enter all fields." });
  }

  // If there are errors, render the form with error messages
  if (errors.length > 0) {
    return res.json({
      asha_login: {
        errors,
        name,
        gender,
        aadhar,
        phone,
        city,
        state,
      },
    });
  }

  try {
    // Check if patient with the given Aadhar number already exists
    let existingPatient = await Patient.findOne({ aadhar });

    if (existingPatient) {
      // Update existing patient's information
      existingPatient.name = name;
      existingPatient.gender = gender;
      existingPatient.phone = phone;
      existingPatient.city = city;
      existingPatient.state = state;
    } else {
      // Create a new patient if they don't exist
      existingPatient = new Patient({
        name,
        gender,
        aadhar,
        phone,
        city,
        state,
      });
    }

    // Store the images and combine them as a single test result

    console.log("Eye image path", nailImageData.path);
    processImage(nailImageData.path).then( async(result) => {

    const resultImages = {
      url: nailImageData.path,
      bodyPart: "Tongue",
      ResultImage: result.image,
    };

    console.log("Result from Python script:", result);
    // Append the new test result to the existing patient's test results
    existingPatient.testResults.push({
      testType: "Combined Test",
      result:result.detections,
      testedBy: ashaEmail,
      images:[resultImages]
    });
  
    // Save the updated patient record
    await existingPatient.save();

    res.json({
      success_msg: "Patient Registered.",
      result,
      testedBy: ashaEmail,
    });
    console.log("Patient Registered");
  });
    // res.redirect(`/user_result?aadhar=${aadhar}`);
  } catch (err) {
    console.error(err);
    res.json({ error_msg: "An error occurred. Please try again later." });
  }
}

async function getRegistrationStatistics(ashaEmail) {
  try {
    const patients = await Patient.find({ "testResults.testedBy": ashaEmail });
    return patients.length;
  } catch (error) {
    console.error("Error finding patients:", error);
    return 0; // or handle the error accordingly
  }
}

async function fetchTestResultsByTester(testedBy) {
  try {
    // Fetch patients where the test results were tested by the specified person
    const patients = await Patient.find({ "testResults.testedBy": testedBy });

    // Extract required data from each patient
    const testData = patients.map((patient) => ({
      name: patient.name,
      aadhar: patient.aadhar,
      city: patient.city,
      testResults: patient.testResults.map((result) => ({
        testDate: result.testDate,
        result: result.result,
      })),
    }));
    console.log(testData);
    // Send the extracted data to the frontend
    return testData;
  } catch (error) {
    // Handle errors
    console.error("Error fetching test results:", error);
    throw error;
  }
}
module.exports = {
  registerHandle,
  getRegistrationStatistics,
  fetchTestResultsByTester: fetchTestResultsByTester,
  // Include this line to export the getRegistrationStatistics function
};
// const Patient = require("../models/Patient");
// const fs = require("fs");

// exports.registerHandle = async (req, res) => {
//   console.log("Entered registerHandle");
//   console.log(req.body);

//   // Access uploaded images from req.files object
//   const eyeImageData = req.files["eyeImageData"][0]; // Assuming single file upload
//   const nailImageData = req.files["nailImageData"][0];
//   const tongueImageData = req.files["tongueImageData"][0];

//   const { name, gender, aadhar, phone, city, state } = req.body;
//   // const { eyeImage, nailImage, tongueImage } = req.files; // Access uploaded files
//   let errors = [];

//   // Checking required fields
//   if (!name || !gender || !aadhar || !phone || !city || !state) {
//     errors.push({ msg: "Please enter all fields." });
//   }

//   // If there are errors, render the form with error messages
//   if (errors.length > 0) {
//     req.flash("error_msg", "Please enter all fields.");
//     return res.render("asha_login", {
//       errors,
//       name,
//       gender,
//       aadhar,
//       phone,
//       city,
//       state,
//     });
//   }

//   try {
//     const newPatient = new Patient({
//       name,
//       gender,
//       aadhar,
//       phone,
//       city,
//       state,
//     });

//     console.log(eyeImageData);
//     newPatient.eyeImage = { url: eyeImageData.path, bodyPart: "Eye" };

//     newPatient.nailImage = { url: nailImageData.path, bodyPart: "Nail" };

//     newPatient.tongueImage = { url: tongueImageData.path, bodyPart: "Tongue" };

//     await newPatient.save();

//     req.flash("success_msg", "Patient Registered.");
//     console.log("Patient Registered");
//     res.redirect(`/user_result?aadhar=${aadhar}`);
//   } catch (err) {
//     console.error(err);
//     req.flash("error_msg", "An error occurred. Please try again later.");
//     res.redirect("/asha_login");
//   }
// };
