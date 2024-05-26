import React, { useEffect, useState } from 'react';
import image from "./download.jpg";
import { useMyContext } from "../MyContext";
import axios from "axios";

const TestResult = () => {
  const { value, setValue } = useMyContext();
  const [patient, setPatient] = useState(null);
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { logout } = useMyContext();
  const handleLogout = () => {
    window.history.back();
  };

  useEffect(() => {
    const aadhar = value.aadhar;
    console.log("global", value);
    axios
      .get(`http://a7db4c829af3f4f7985d8f62705bf031-1032979001.ap-south-1.elb.amazonaws.com:3006/user_result?aadhar=${aadhar}`)
      .then((res) => {
        setData(res.data.user_result.patient);
        setPatient(res.data.user_result.patient);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    try {
      console.log("Original date string:", dateString); // Log the date string for inspection
      const date = new Date(Date.parse(dateString));
      console.log("Parsed date:", date); // Log the parsed date
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="container mx-auto px-4 py-0 sm:px-0">
        {patient && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-blue-500 text-white rounded-t-lg px-4 py-3 relative">
              <button className="absolute top-2 left-2 rounded-lg bg-indigo-800 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base" onClick={handleLogout}>
                Back
              </button>
              <h2 className="text-2xl font-semibold text-center sm:text-3xl">Patient Information</h2>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-4 p-3">
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">Name:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.name}</p>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">Phone:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.phone}</p>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">Gender:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.gender}</p>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">Aadhar:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.aadhar}</p>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">City:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.city}</p>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-sm sm:w-30 sm:text-lg font-semibold text-gray-700">State:</p>
                  <p className="text-sm sm:text-lg text-gray-900">{data.state}</p>
                </div>
              </div>
            </div>

            {/* Test Results Section */}
            <div className="bg-gray-400 rounded-lg shadow-lg mt-8 p-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">Test Results</h3>
              {data.testResults.map((testresult, index) => {
                // Find the test result with the highest confidence
                const maxConfidenceResult = testresult.result.reduce((prev, current) => {
                  return parseFloat(current.confidence.$numberDouble) > parseFloat(prev.confidence) ? current : prev;
                });

                return (
                  <div key={index} className="bg-white rounded-lg shadow-lg mt-2 p-4 flex flex-col sm:flex-row items-center justify-center">
                    <div className="w-full sm:w-5/12 mb-4 sm:mb-0 pr-4 sm:pr-0">
                      <div className="flex flex-col items-center sm:items-start">
                        <div className="flex items-center mb-2">
                          <p className="w-28 text-sm sm:w-32 sm:text-lg font-semibold text-gray-700">Test Date:</p>
                          <p className="text-sm sm:text-lg text-gray-900">{testresult.testDate}</p>
                        </div>
                        <div className="flex items-center mb-2">
                          <p className="w-28 text-sm sm:w-32 sm:text-lg font-semibold text-gray-700">Test Result:</p>
                          <p className="text-sm sm:text-lg text-gray-900">{maxConfidenceResult.class_name}&nbsp; - &nbsp; Confidence: &nbsp;{maxConfidenceResult.confidence.toString()}</p>
                        </div>
                        <div className="flex items-center mb-2">
                          <p className="w-28 text-sm sm:w-32 sm:text-lg font-semibold text-gray-700">Tested By:</p>
                          <p className="text-sm sm:text-lg text-gray-900">{testresult.testedBy}</p>
                        </div>
                        {testresult.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="flex items-center mb-2">
                            <p className="w-28 text-sm sm:w-32 sm:text-lg font-semibold text-gray-700">Body Part:</p>
                            <p className="text-sm sm:text-lg text-gray-900">{img.bodyPart}</p>
                          </div>
                        ))}
                      </div>
                      {testresult.response && ( // Check if medication is not empty
                        <div className="flex items-center mb-2">
                          <p className="w-28 text-sm sm:w-32 sm:text-lg font-semibold text-gray-700">Medication:</p>
                          <p className="text-sm sm:text-lg text-gray-900">{testresult.response}</p>
                        </div>
                      )}
                    </div>
                    <div className="w-full sm:w-5/12 pl-4 sm:pl-0">
                      <div className='p-4 sm:p-8'>
                        <p className="text-sm sm:text-lg font-semibold text-gray-700 text-center mb-2">Image:</p>
                        {testresult.images.map((img, imgIndex) => (
                          <img key={imgIndex} src={image} alt={img.bodyPart} className="mx-auto rounded-lg cursor-pointer mb-2" style={{ maxWidth: '100%', height: 'auto' }} onClick={() => handleImageClick(image)} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Modal for displaying the image */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg overflow-hidden relative">
            <img src={selectedImage} alt="Selected Image" className="w-full" />
            <button className="absolute top-2 right-2 text-white text-xl" onClick={closeModal}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResult;
