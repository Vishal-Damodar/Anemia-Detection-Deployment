const Patient = require("../models/Patient");

async function getPatients(filter) {
    try {
        const patients = await Patient.find();
        let filteredPatients;
        console.log("patinet", filter);
        if (!filter) {
            // If filter is not provided in the query parameters, return all patients
            filteredPatients = patients;
        } else if (filter === "responded") {
            filteredPatients = patients.filter((patient) =>
                patient.testResults.some((testResult) => testResult.response),
            );
        } else if (filter === "unresponded") {
            filteredPatients = patients.filter(
                (patient) =>
                    !patient.testResults.some(
                        (testResult) => testResult.response,
                    ),
            );
        } else {
            // Invalid filter parameter
            throw new Error("Bad Request");
        }

        // Sort the filtered patients by test date in descending order
        filteredPatients.sort((a, b) => {
            const latestTestDateA = Math.max(...a.testResults.map(result => new Date(result.testDate)));
            const latestTestDateB = Math.max(...b.testResults.map(result => new Date(result.testDate)));
            return latestTestDateB - latestTestDateA;
        });

        return filteredPatients;
    } catch (error) {
        console.error("Error fetching patients data:", error);
        throw error;
    }
}

module.exports = { getPatients };
