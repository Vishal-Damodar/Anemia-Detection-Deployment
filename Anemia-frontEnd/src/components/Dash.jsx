import React, { useState, useEffect } from "react";
import axios from "axios";

function Dash() {
  const [active, setActive] = useState("patient");
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3006/doctor_login", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        if (res.data === "register") {
          toast.success("Login failed");
        }
      })
      .catch((err) => console.log("ERROR:::::::", err));
  }, []);

  const getHighestConfidenceResult = (results) => {
    if (!results || results.length === 0) return null;
    let highestConfidenceResult = results[0];
    for (let i = 1; i < results.length; i++) {
      if (results[i].confidence > highestConfidenceResult.confidence) {
        highestConfidenceResult = results[i];
      }
    }
    return highestConfidenceResult;
  };

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li className="me-2" onClick={() => setActive("patient")}>
            <div
              className={`inline-block p-4 bg-gray-100 rounded-t-lg active ${
                active === "patient"
                  ? "dark:bg-gray-800 dark:text-blue-500 text-blue-600"
                  : "dark:hover:bg-gray-800"
              }`}
            >
              Patients
            </div>
          </li>
          <li className="me-2" onClick={() => setActive("response")}>
            <div
              className={`inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ${
                active === "response"
                  ? "dark:bg-gray-800 dark:text-blue-500 text-blue-600"
                  : "dark:hover:bg-gray-800"
              } dark:hover:bg-gray-800 dark:hover:text-gray-300`}
            >
              Response
            </div>
          </li>
        </ul>

        <div className="container px-5 py-24 mx-auto">
          {active === "patient" && (
            <div className="-my-8 divide-y-2 divide-gray-400">
              {data.map((item) => (
                <div key={item._id} className="py-8 flex flex-wrap md:flex-nowrap">
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold title-font text-gray-700">
                      {item.name}
                    </span>
                    <span className="mt-1 text-gray-500 text-sm">
                      {new Date(item.testResults[0].testDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="md:flex-grow">
                    {item.testResults.map((result) => {
                      const highestConfidenceResult = getHighestConfidenceResult(result.result);
                      if (highestConfidenceResult) {
                        return (
                          <div key={result._id} className="mb-8 flex">
                            <div className="w-1/2 max-w-md">
                              <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                {result.testType}
                              </h2>
                              <p className="leading-relaxed">
                                <strong>Class Name:</strong> {highestConfidenceResult.class_name}, <strong>Confidence:</strong> {highestConfidenceResult.confidence}
                              </p>
                              <a
                                href="#"
                                className="text-indigo-500 inline-flex items-center mt-4"
                              >
                                Learn More
                                <svg
                                  className="w-4 h-4 ml-2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14"></path>
                                  <path d="M12 5l7 7-7 7"></path>
                                </svg>
                              </a>
                            </div>
                            <div className="w-1/2 ml-4">
                              <textarea
                                className="w-full h-24 border-2 border-gray-300 p-2"
                                placeholder="Type here..."
                              ></textarea>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dash;
