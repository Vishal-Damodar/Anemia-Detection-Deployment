const Patient = require("../models/Patient");

async function getPatients(filter) {
    try {
        const patients = await Patient.find();
        let filteredPatients;
        console.log("patinet", filter);
        if (!filter) {
            // If filter is not provided in the query parameters, return all patients
            filteredPatients = patients;
            return filteredPatients;
        } else if (filter === "responded") {
            filteredPatients = patients.filter((patient) =>
                patient.testResults.some((testResult) => testResult.response),
            );
            return filteredPatients;
        } else if (filter === "unresponded") {
            filteredPatients = patients.filter(
                (patient) =>
                    !patient.testResults.some(
                        (testResult) => testResult.response,
                    ),
            );
            return filteredPatients;
        } else {
            // Invalid filter parameter
            return res.status(400).send("Bad Request");
        }
    } catch (error) {
        console.error("Error fetching patients data:", error);
    }
}
module.exports = { getPatients };