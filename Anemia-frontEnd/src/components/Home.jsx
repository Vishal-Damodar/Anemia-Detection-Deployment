import React from "react";
import { useState } from "react";
import { useMyContext } from "../MyContext";

const Home = (props) => {
  const { value, setValue } = useMyContext();

  const [active, setActive] = useState("user");
  const sendDataToParent = () => {
    setValue({...value,role:active})
    props.handleCallback(active);
  };
  return (
    <div className="bg-white pt-12 sm:pt-16 lg:pt-24">
      <nav className="sticky bottom-0 mx-auto flex w-full justify-between gap-8 border-t bg-white px-10 pt-5 pb-3 text-xs sm:max-w-md sm:rounded-t-xl sm:border-l sm:border-r sm:text-sm">
        <div>
          <span
            onClick={() => {setActive("user");sendDataToParent()}}
            
            className={`flex flex-col items-center gap-1 ${
              active == "user" ? "text-indigo-500" : ""
            } `}>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>

            <span>User</span>
          </span>
        </div>
        <div
          href="#"
          onClick={() => {setActive("doctor");sendDataToParent()}}
          className="flex flex-col items-center gap-1 text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
        >
          <span
            className={`flex flex-col items-center gap-1 ${
              active == "doctor" ? "text-indigo-500" : ""
            }`}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>

            <span>Doctor</span>
          </span>
        </div>

        <div
          href="#"
          onClick={() => {setActive("SHA");sendDataToParent()}}
          className="flex flex-col items-center gap-1 text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600"
        >
          <span
            className={`flex flex-col items-center gap-1 ${
              active == "SHA" ? "text-indigo-500" : ""
            }
             `}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clip-rule="evenodd"
              />
            </svg>

            <span>Social health activist</span>
          </span>
        </div>
      </nav>
    </div>
  );
};

export default Home;
