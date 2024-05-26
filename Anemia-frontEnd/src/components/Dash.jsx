import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


function Dash() {
  const [active, setActive] = useState("patient");
  const [data, setData] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState(""); // State for acknowledgment message
  const [detctions, setdetctions] = useState([]);
  const [img, setimg] = useState("");
  const [open, setOpen] = useState(false); // State to manage dialog open/close

  useEffect(() => {
    let url;
    setLoading(true); // Set loading to true when fetching data
    if (active === 'patient') {
      url = "http://localhost:3006/doctor_login?filter=unresponded";
    } else if (active === 'response') {
      url = "http://localhost:3006/doctor_login?filter=responded";
    }

    axios
      .get(url, {
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
        setLoading(false); // Set loading to false when data is fetched
        console.log(res.data);
        if (res.data === "register") {
          toast.success("Login failed");
        }
      })
      .catch((err) => {
        setLoading(false); // Set loading to false on error
        console.log("ERROR:::::::", err);
      });
  }, [active]);

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

  const handleResponseChange = (testResultId, value) => {
    setResponses({
      ...responses,
      [testResultId]: value,
    });
  };

  const handleSubmit = (patientId, testResultId) => {
    const response = responses[testResultId];
    if (response) {
      axios
        .post(`http://localhost:3006/update_response`, {
          patientId,
          testResultId,
          response,
        })
        .then((res) => {
          console.log("Response submitted:", res.data);
          setAcknowledgment("Response submitted successfully!");
          // Optionally update the local state with the new response
          setData((prevData) =>
            prevData.map((patient) =>
              patient._id === patientId
                ? {
                  ...patient,
                  testResults: patient.testResults.map((result) =>
                    result._id === testResultId
                      ? { ...result, response }
                      : result
                  ),
                }
                : patient
            )
          );
        })
        .catch((err) => console.log("ERROR:::::::", err));
    }
  };

  const onSubmit = () => {
    // Fetch data for dialog content
    console.log("on submit");
    // Example: axios.get('URL').then((res) => setDetctions(res.data.detections));
    setOpen(true);
    return;
  };

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li className="me-2" onClick={() => setActive("patient")}>
            <div
              className={`inline-block p-4 bg-gray-100 rounded-t-lg ${active === "patient"
                ? "dark:bg-gray-800 dark:text-blue-500 text-blue-600"
                : "dark:hover:bg-gray-800"
                }`}
            >
              Patients
            </div>
          </li>
          <li className="me-2" onClick={() => setActive("response")}>
            <div
              className={`inline-block p-4 bg-gray-100 rounded-t-lg ${active === "response"
                ? "dark:bg-gray-800 dark:text-blue-500 text-blue-600"
                : "dark:hover:bg-gray-800"
                }`}
            >
              Response
            </div>
          </li>
        </ul>

        <div className="container px-5 py-24 mx-auto">
          {loading && <div>Loading...</div>} {/* Loader */}
          {acknowledgment && <div>{acknowledgment}</div>} {/* Acknowledgment message */}
          {active === "patient" && (
            <div className="-my-8 divide-y-2 divide-gray-400">
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
                        {item.testResults.map((result, index) => {
                          const highestConfidenceResult = getHighestConfidenceResult(result.result);
                          if (highestConfidenceResult) {
                            return (
                              <div key={result._id || index} className="mb-8 flex">
                                <div className="w-1/2 max-w-md">
                                  <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                                    {result.testType}
                                  </h2>
                                  <p className="leading-relaxed">
                                    <strong></strong> {highestConfidenceResult.class_name}, <strong></strong> {highestConfidenceResult.confidence}
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
                                    value={responses[result._id] || result.response || ''}
                                    onChange={(e) => handleResponseChange(result._id, e.target.value)}
                                  ></textarea>
                                  <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={() => handleSubmit(item._id, result._id)}
                                  >
                                    Submit
                                  </button>
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
          )}
          {active === "response" && (
  <div className="-my-8 divide-y-2 divide-gray-400">
    {active === "response" && (
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
              {item.testResults.map((result, index) => {
                const highestConfidenceResult = getHighestConfidenceResult(result.result);
                if (highestConfidenceResult) {
                  return (
                    <div key={result._id || index} className="mb-8 flex">
                      <div className="w-1/2 max-w-md">
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                          {result.testType}
                        </h2>
                        <p className="leading-relaxed">
                          <strong> </strong> {highestConfidenceResult.class_name}, <strong></strong> {highestConfidenceResult.confidence}
                        </p>
                        
                        <Dialog>
                          <DialogTrigger >
                            <button
                              onClick={() => onSubmit()}
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
                            </button>
                          </DialogTrigger>
                          {open && (
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Test Results</DialogTitle>
                                <DialogDescription>
                                  The below are the results of the Patient
                                </DialogDescription>
                              </DialogHeader>
                              <div>
                                {result.result && result.result.map((item) => (
                                  <div className="flex items-center justify-between sm:col-span-2" key={item._id}>
                                    <span>{item.class_name}</span><span>{item.confidence}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center space-x-2">
                                {result.images && result.images.ResultImage && (
                                  <img src={`data:image/png;base64,${result.images.ResultImage}`} alt="" />
                                )}
                              </div>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose open>
                                  <button type="button" onClick={() => setOpen(false)} variant="secondary" >
                                    Close
                                  </button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        
                      </div>
                      <div className="w-1/2 ml-4">
                        <textarea
                          className="w-full h-24 border-2 border-gray-300 p-2"
                          placeholder="Type here..."
                          value={responses[result._id] || result.response || ''}
                          onChange={(e) => handleResponseChange(result._id, e.target.value)}
                        ></textarea>
                        <button
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={() => handleSubmit(item._id, result._id)}
                        >
                          Submit
                        </button>
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
)}
        </div>
      </section>
    </div>
  );
}

export default Dash;
