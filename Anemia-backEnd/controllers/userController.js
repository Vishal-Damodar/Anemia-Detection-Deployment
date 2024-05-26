const Patient = require("../models/Patient");
const { processImage } = require("../pythonModel/imageProcessor");
const { json } = require("express");

exports.register = async (req, res)  => {
  console.log("Entered registerHandle");
  // console.log(req.body);
  console.log("files", req.files);

  // Access uploaded images from req.files object
  const nailImageData = req.files["nailImageData"][0]; // Single image

  const { name, gender, aadhar, phone, city, state } = req.body;
  console.log(req.body);
  let errors = [];

  // Checking required fields
  if (!name || !gender || !aadhar || !phone || !city || !state) {
    errors.push({ msg: "Please enter all fields." });
  }

  // If there are errors, render the form with error messages
  if (errors.length > 0) {
    return res.json({
      take_test: {
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
      testedBy: "Self Tested",
      images:[resultImages]
    });
  
    // Save the updated patient record
    await existingPatient.save();

    res.json({
      success_msg: "Patient Registered.",
      result,
      testedBy: "Self Tested",
    });
    console.log("Patient Registered");
  });
    // res.redirect(`/user_result?aadhar=${aadhar}`);
  } catch (err) {
    console.error(err);
    res.json({ error_msg: "An error occurred. Please try again later." });
  }
}

exports.getUserResult = async (req, res) => {
  try {
    const aadhar = req.query.aadhar;

    const patient = await Patient.findOne({ aadhar });

    if (!patient) {
      return res.json({user_result: { error: "Patient not found" }});
    }
    patient.testResults.sort((a, b) => b.testDate - a.testDate);
    res.json({user_result: { patient }});
  } catch (err) {
    console.error(err);
    res.json({user_result:{
      error: "An error occurred. Please try again later.",}
    });
  }
};

