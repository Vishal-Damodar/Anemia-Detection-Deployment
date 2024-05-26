import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useMyContext } from "../MyContext";
import { Link, useNavigate } from "react-router-dom";
import eyeSvg from "./eye.svg"; // Import your SVG icon
import hideSvg from "./hide.svg";

function Signup() {
  const { value, setValue } = useMyContext();
  const emailRef = useRef(null);
  const passwordRef = useRef(null); // Added ref for password input
  const phoneRef = useRef(null);
  const aadharRef = useRef(null);
  const password2Ref = useRef(null);
  const ashaRef = useRef(null);
  const nameRef = useRef(null);

  const { logout } = useMyContext();

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    logout();
  };

  const [params, setParams] = useState({
    name: { value: "", valid: false, error: "" },
    aadhar: { value: "", valid: false, error: "" },
    phone: { value: "", valid: false, error: "" },
    email: { value: "", valid: false, error: "" },
    role: { value: "", valid: false, error: "" },
    password: { value: "", valid: false, error: "" },
    password2: { value: "", valid: false, error: "" },
  });

  const [nameTouched, setNameTouched] = useState(false);
  const [aadharTouched, setAadharTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [password2Touched, setPassword2Touched] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  useEffect(() => {
    // Focus on the email input field when the component mounts
    nameRef.current.focus();
  }, []);

  const onsubmit = () => {
    const isValid = Object.values(params).every((field) => field.valid);
    console.log("on submit");
    if (!isValid) {
      const updatedParams = {};
      Object.keys(params).forEach((key) => {
        if (!params[key].valid) {
          updatedParams[key] = {
            ...params[key],
            error: "This field is required.",
          };
        } else {
          updatedParams[key] = params[key];
        }
      });
      setParams(updatedParams);
      if (params.password.value !== params.password2.value) {
        return toast.error("Passwords do not match");
      } else if (params.password.value.length < 8) {
        return toast.error("Passwords must be at least 8 characters");
      }
    }

    const formData = {
      name: params.name.value,
      aadhar: params.aadhar.value,
      phone: params.phone.value,
      email: params.email.value,
      role: params.role.value,
      password: params.password.value,
      password2: params.password2.value,
    };
    console.log(formData);
    axios
      .post("http://localhost:3006/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      })
      .then((res) => {
        if (res.data.register?.errors.length > 0)
          toast.error(res.data.register?.errors[0]?.msg);
        else {
          toast.success(res.data.success_msg);
          setTimeout(() => {
            navigate("/login");
          }, 4000);
          ;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (field, value) => {
    setParams((prevParams) => ({
      ...prevParams,
      [field]: {
        value: value,
        valid: value.trim() !== "",
        error: value.trim() === "" ? "This field is required." : "",
      },
    }));
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     if (e.target.name === "email") {
  //       if (validateEmail(params.email.value)) {
  //         passwordRef.current.focus();
  //       } else {
  //         setEmailTouched(true);
  //       }
  //     } else if (e.target.name === "password") {
  //       if (
  //         validateEmail(params.email.value) &&
  //         params.password.value.length >= 8
  //       ) {
  //         setPressed(true);
  //         setTimeout(() => {
  //           setPressed(false);
  //           onsubmit();
  //         }, 200);
  //       } else {
  //         if (!validateEmail(params.email.value)) setEmailTouched(true);
  //         if (params.password.value.length < 8) setPasswordTouched(true);
  //       }
  //     }
  //   }
  // };




  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      console.log(params.name.value.length);
      if (e.target.name === "name") {
        if (params.name.value.length > 1) {
          emailRef.current.focus();
        } else {
          setNameTouched(true);
        }
      } else if (e.target.name === "email") {
        if (validateEmail(params.email.value)) {
          phoneRef.current.focus();
        } else {
          setEmailTouched(true);
        }
      } else if (e.target.name === "phone") {
        if (validatePhoneNumber(params.phone.value)) {
          aadharRef.current.focus();
        } else {
          setPhoneTouched(true);
        }
      } else if (e.target.name === "aadhar") {
        if (validateAadharNumber(params.aadhar.value)) {
          passwordRef.current.focus();
        } else {
          setAadharTouched(true);
        }
      } else if (e.target.name === "password") {
        if (
          validateEmail(params.email.value) &&
          params.password.value.length >= 8
        ) {
          password2Ref.current.focus();
        } else {
          setPasswordTouched(true);
        }
      } else if (e.target.name === "password2") {
        if (
          validateEmail(params.email.value) &&
          params.password2.value.length >= 8
        ) {
          ashaRef.current.focus();
        } else {
          setPassword2Touched(true);
        }
      }
    }
  };



  const validateAadharNumber = (aadhar) => {
    const aadharPattern = /^\d{12}$/;
    if (!aadharPattern.test(aadhar)) {
      return 0;
    }
    return 1;
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^[6-9]\d{9}$/; // Example for Indian phone numbers
    if (!phonePattern.test(phone)) {
      return 0;
    }
    return 1;
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

        <div className="container mt-3 max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-xl shadow-gray-400 text-black w-full max-w-screen-lg mx-auto">
            <h1 className="mb-3 text-3xl text-center">Sign up</h1>



            <div>
              <label
                htmlFor="name"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Name
              </label>
              <input
                ref={nameRef} // Set the ref to the email input
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => setNameTouched(true)}
                onKeyDown={handleKeyDown}
                name="name"
                className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${params.name.value.length < 1 && nameTouched
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {params.name.value.length < 1 && nameTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a name
                </p>
              )}
            </div>





            <div>
              <label
                htmlFor="email"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Email
              </label>
              <input
                ref={emailRef} // Set the ref to the email input
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => setEmailTouched(true)}
                onKeyDown={handleKeyDown}
                name="email"
                className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${!validateEmail(params.email.value) && emailTouched
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {!validateEmail(params.email.value) && emailTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>




            <div>
              <label
                htmlFor="phone"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Phone Number
              </label>
              <input
                ref={phoneRef} // Set the ref to the email input
                type="number"
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => setPhoneTouched(true)}
                onKeyDown={handleKeyDown}
                name="phone"
                className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${!validatePhoneNumber(params.phone.value) && phoneTouched
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {!validatePhoneNumber(params.phone.value) && phoneTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid Phone Number
                </p>
              )}
            </div>





            {/* <input
              onChange={(e) => handleInputChange("phone", e.target.value)}
              type="number"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="phone"
              placeholder="Phone Number"
            />
            {!params.phone.valid && (
              <span className="text-red-500">{params.phone.error}</span>
            )} */}


            <div>
              <label
                htmlFor="aadhar"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                AADHAR Number
              </label>
              <input
                ref={aadharRef} // Set the ref to the email input
                type="number"
                onChange={(e) => handleInputChange("aadhar", e.target.value)}
                onBlur={() => setAadharTouched(true)}
                onKeyDown={handleKeyDown}
                name="aadhar"
                className={`w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring ${!validateAadharNumber(params.aadhar.value) && aadharTouched
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
              />
              {!validateAadharNumber(params.aadhar.value) && aadharTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid AADHAR Number
                </p>
              )}
            </div>

            {/* <input
              onChange={(e) => handleInputChange("aadhar", e.target.value)}
              type="number"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              name="aadhar"
              placeholder="Aadhar Number"
            />
            {!params.aadhar.valid && (
              <span className="text-red-500">{params.aadhar.error}</span>
            )} */}
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
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  onKeyDown={handleKeyDown}
                  name="password"
                  type={showPassword ? "text" : "password"} // Show plain text if showPassword is true
                  className={`flex-grow outline-none appearance-none bg-transparent ${params.password.value.length < 8 && passwordTouched
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
              {params.password.value.length < 8 && passwordTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Password must be at least 8 characters
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password2"
                className="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Confirm Password
              </label>
              <div className="flex items-center border rounded bg-gray-50 px-3 py-2 text-gray-800 ring-indigo-300 transition duration-100 focus-within:ring">
                <input
                  ref={password2Ref}
                  onBlur={() => setPassword2Touched(true)}
                  onChange={(e) => handleInputChange("password2", e.target.value)}
                  type={showPassword ? "text" : "password"} // Show plain text if showPassword is true
                  className={`flex-grow outline-none appearance-none bg-transparent ${params.password2.value !== params.password.value &&
                    passwordTouched && password2Touched
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
              {params.password2.value !== params.password.value &&
                passwordTouched && password2Touched && (
                  <p className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>
            <div>
              <div className="m-4 mb-8">
                <span className="gap mr-6">Role:</span>
                <label className="inline-flex items-center mr-6">
                  <input
                    type="radio"
                    ref={ashaRef}
                    className="form-radio"
                    name="role"
                    value="Asha"
                    checked={params.role.value === "Asha"}
                    onChange={(e) =>
                      handleInputChange("role", e.target.value)
                    }
                  />
                  <span className="ml-2 text-gray-800">Asha</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="role"
                    value="Doctor"
                    checked={params.role.value === "Doctor"}
                    onChange={(e) =>
                      handleInputChange("role", e.target.value)
                    }
                  />
                  <span className="ml-2 text-gray-800">Doctor</span>
                </label>
                <br />
                {!params.role.valid && (
                  <span className="text-red-500">{params.role.error}</span>
                )}
              </div>
            </div>

            <button
              onClick={onsubmit}
              type="submit"
              className="w-full block rounded-lg bg-gray-800 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
            >
              Create Account
            </button>

            <div className="text-center text-sm text-grey-dark mt-4">
              By signing up, you agree to the{" "}
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                className="no-underline border-b border-grey-dark text-grey-dark"
                href="#"
              >
                Privacy Policy
              </a>
            </div>
            <div className="text-grey-dark mt-6 flex justify-center items-center">
              <span>Already have an account?</span>
              <Link to="/login">
                <button className="ml-2 no-underline border-b border-blue text-blue">
                  Log in
                </button>
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default Signup;
