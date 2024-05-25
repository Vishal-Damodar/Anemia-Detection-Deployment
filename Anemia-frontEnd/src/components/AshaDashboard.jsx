import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyContext } from "../MyContext";
import { Link } from "react-router-dom";

const AshaDashboard = () => {
  const { value, setValue } = useMyContext();
  const [testResults, setTestResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .post("http://a7db4c829af3f4f7985d8f62705bf031-1032979001.ap-south-1.elb.amazonaws.com:3006/asha_login/view_patients", value.user, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      })
      .then((res) => {
        const formattedResults = formatResults(res.data.testResults);
        setTestResults(formattedResults);
      })
      .catch((err) => console.log(err));
  }, []);

  const formatResults = (data) => {
    const formattedResults = {};
  
    data.forEach((patient) => {
      const { name, aadhar, city, testResults } = patient;
  
      testResults.forEach((test) => {
        test.result.forEach((result) => {
          const currentResult = {
            name,
            aadhar,
            city,
            testDate: new Date(test.testDate),
            className: result.class_name,
            confidence: result.confidence,
          };
  
          if (!(aadhar in formattedResults) || result.confidence > formattedResults[aadhar].confidence) {
            formattedResults[aadhar] = currentResult;
          }
        });
      });
    });
  
    return Object.values(formattedResults).sort((a, b) => b.testDate - a.testDate);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredResults = testResults.filter((result) =>
    Object.values(result).some((field) =>
      field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 bg-gray-100 dark:bg-gray-900">
      <div className="mb-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200 lg:text-3xl">
          History of Test Results
        </h2>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search Patient"
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Link
          to={"/patient"}
          className="inline-block px-6 py-2 text-center text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus-visible:ring ring-indigo-300 active:bg-indigo-700 md:text-base"
        >
          Back Home
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
            <tr className="rounded-lg">
              <th className="px-6 py-3 rounded-tl-lg">Patient Name</th>
              <th className="px-6 py-3">Aadhar</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Test Date</th>
              <th className="px-6 py-3 rounded-tr-lg">Results</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b dark:border-gray-700`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {result.name}
                </td>
                <td className="px-6 py-4">{result.aadhar}</td>
                <td className="px-6 py-4">{result.city}</td>
                <td className="px-6 py-4">
                  {result.testDate.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {result.className} {result.confidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AshaDashboard;
