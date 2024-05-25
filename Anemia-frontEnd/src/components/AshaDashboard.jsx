import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyContext } from "../MyContext";
import { Link } from "react-router-dom";

const AshaDashboard = () => {
  const { value, setValue } = useMyContext();
  console.log("value", value);
  const [data, setData] = useState([]);
  useEffect(() => {
    // axios.defaults.headers.common['Authorization'] = `Bearer ${value.token}`;
    axios
      .post("http://localhost:3006/asha_login/view_patients", value.user, {
        withCredentials: true, // include credentials
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onsubmit = () => {};
  return (
    <React.Fragment>
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
      <div class="mb-5  md:mb-10 ">
        <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
          History of Test results
        </h2>
        <Link to={'/patient'}  class="  mr-5 my-3 rounded-lg bg-indigo-500 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">
      back home
      </Link>
      </div>
      <div class=" w-full h-auto relative flex justify-center items-center overflow-x-auto rounded-lg">
        <table class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="rounded-lg">
              <th scope="col" class="px-6 py-3 rounded-tl-lg">
                Patient name
              </th>
              <th scope="col" class="px-6 text-center py-4">
                Addhar
              </th>
              <th scope="col" class="px-6 text-center py-4">
                City
              </th>
              <th scope="col" class="px-6 text-center py-4">
                Test Date
              </th>
              <th scope="col" class="px-6 py-4 text-center rounded-tr-lg">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {data.testResults &&
              data.testResults.map((person, index) => (
                <React.Fragment key={index}>
                  {person.testResults.map((test, i) => (
                    <tr
                      key={i}
                      class={`${
                        index % 2 === 0
                          ? " dark:bg-gray-900"
                          : " dark:bg-gray-800"
                      } border-b rounded-b-lg dark:border-gray-700 ${
                        index === person.testResults.length - 1
                          ? "rounded-b-lg"
                          : ""
                      }`}
                    >
                      {i === 0 && (
                        <React.Fragment>
                          <td
                            class=" px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            rowSpan={person.testResults.length}
                          >
                            {person.name}
                          </td>
                          <td
                            class="px-6 py-4"
                            rowSpan={person.testResults.length}
                          >
                            {person.aadhar}
                          </td>
                          <td
                            class="px-6 py-4"
                            rowSpan={person.testResults.length}
                          >
                            {person.city}
                          </td>
                        </React.Fragment>
                      )}
                      <td class="px-6 py-4">
                        {new Date(test.testDate).toLocaleString()}
                      </td>
                      <td class="px-6 py-4">{test.result}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      </div>
    </React.Fragment>
  );
};

export default AshaDashboard;
