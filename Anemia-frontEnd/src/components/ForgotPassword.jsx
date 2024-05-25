import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


const ForgotPassword = () => {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [pressed, setPressed] = useState(false);

  const navigate = useNavigate();

  // Focus on the email input field when the component mounts
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Mark email input as touched on blur
  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  // Submit the form
  const handleSubmit = () => {
    // Validate email format
    if (!validateEmail(email)) {
      setEmailTouched(true);
      return;
    }

    // Send email to backend
    axios
      .post("http://localhost:3006/auth/forgot", { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // Handle response from backend
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          toast.success("Password reset link sent to your email.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      });
  };

  // Handle key down event for form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setPressed(true);
      setTimeout(() => {
        setPressed(false);
        handleSubmit();
      }, 200);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
        
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded-3xl shadow-xl shadow-gray-400 text-black w-full max-w-screen-lg mx-auto">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
          Forgot Your Password?
        </h2>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <div>
            <label
              htmlFor="email"
              className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
            >
              Email
            </label>
            <input
              ref={emailRef}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onKeyDown={handleKeyDown}
              name="email"
              className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${
                !validateEmail(email) && emailTouched
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {!validateEmail(email) && emailTouched && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className={`block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base ${
              pressed ? "transform scale-95" : ""
            }`}
          >
            Submit
          </button>
        </div>

        <div className="flex items-center justify-center bg-gray-100 p-4">
          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
              to="/login"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div></div>
  );
};

export default ForgotPassword;
