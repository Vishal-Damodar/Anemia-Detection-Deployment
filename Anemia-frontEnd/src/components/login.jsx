import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useMyContext } from "../MyContext";
import eyeSvg from "./eye.svg"; // Import your SVG icon
import hideSvg from "./hide.svg";

const Login = () => {
  const { value, setValue } = useMyContext();
  const emailRef = useRef(null); // Reference for the email input field
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const { logout } = useMyContext();

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    logout();
  };
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  useEffect(() => {
    // Focus on the email input field when the component mounts
    emailRef.current.focus();
  }, []);

  const onsubmit = () => {
    console.log("on submit sign in");
    axios
      .post("http://localhost:3006/auth/login", formData, {
        withCredentials: true, // include credentials
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data === "register") toast.error("Login failed");
        else {
          setValue({
            ...value,
            user: res.data.user,
            token: res.data.token,
          });
          console.log(res.data.successRedirect);

          if(res.data.successRedirect == "/asha_login")
            navigate("/patient");
          else
            navigate("/Dash")
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "email") {
        if (validateEmail(formData.email)) {
          passwordRef.current.focus();
        } else {
          setEmailTouched(true);
        }
      } else if (e.target.name === "password") {
        if (validateEmail(formData.email) && formData.password.length >= 8) {
          setPressed(true);
          setTimeout(() => {
            setPressed(false);
            onsubmit();
          }, 200);
        } else {
          if (!validateEmail(formData.email)) setEmailTouched(true);
          if (formData.password.length < 8) setPasswordTouched(true);
        }
      }
    }
  };




  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
            <button className="absolute mt-3 ml-3 rounded-lg bg-gray-700 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-gray-700 transition duration-100 hover:bg-gray-600 focus-visible:ring active:bg-gray-700 md:text-base"
    onClick={handleLogout}
>Back</button>
      <Toaster toastOptions={{ duration: 4000 }} />
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded-3xl shadow-xl shadow-gray-400 text-black w-full max-w-screen-lg mx-auto">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
            Login
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
                ref={emailRef} // Set the ref to the email input
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                onKeyDown={handleKeyDown}
                name="email"
                className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${
                  !validateEmail(formData.email) && emailTouched
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {!validateEmail(formData.email) && emailTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            

            <div className="relative">
              <label
                htmlFor="password"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Password
              </label>
              <div className="flex items-center border rounded bg-gray-50 px-3 py-2 text-gray-800 ring-indigo-300 transition duration-100 focus-within:ring">
                <input
                  ref={passwordRef}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  onKeyDown={handleKeyDown}
                  name="password"
                  type={showPassword ? "text" : "password"} // Show plain text if showPassword is true
                  className={`flex-grow outline-none appearance-none bg-transparent ${
                    formData.password.length < 8 && passwordTouched
                      ? "border-red-500"
                      : "border-transparent"
                  }`}
                />
                {/* Show/hide password toggle button */}
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <img
                      src={hideSvg}
                      alt="Hide Password"
                      className="h-5 w-5 text-gray-600"
                    />
                  ) : (
                    <img
                      src={eyeSvg}
                      alt="Show Password"
                      className="h-5 w-5 text-gray-600"
                    />
                  )}
                </button>
              </div>
              {formData.password.length < 8 && passwordTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Password must be at least 8 characters
                </p>
              )}
            </div>
            <div className="text-right mt-2">
                <Link
                  to="/forgot"
                  className="text-sm text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                >
                  Forgot your password?
                </Link>
              </div>

            <button
              onClick={onsubmit}
              className={`block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base ${
                pressed ? "transform scale-95" : ""
              }`}
            >
              Log in
            </button>
          </div>

          <div className="flex items-center justify-center bg-gray-100 p-4">
            <p className="text-center text-sm text-gray-500">
              Don't have an account?
              <Link
                className="text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                to={"/Signup"}
              >
                Register
              </Link>
            </p>
          </div>
        </div></div>
      </div>
    </div>
  );
};

export default Login;
