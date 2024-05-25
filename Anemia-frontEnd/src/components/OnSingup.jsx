import React, { useState } from "react";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';
import { useMyContext } from "../MyContext";

const App = () => {
  const { value, setValue } = useMyContext();

  const [otp, setOtp] = useState("123456");
  const [aadhar, setAadhar] = useState("285950905601");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [aadharError, setAadharError] = useState("");
  const navigate = useNavigate();

  const { logout } = useMyContext();

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    logout();
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  const fetchPhoneNumber = async (aadharNumber) => {
    try {
      console.log("client");
      const response = await axios.post("http://a7db4c829af3f4f7985d8f62705bf031-1032979001.ap-south-1.elb.amazonaws.com:3006/get-phone-number", { aadhar: aadharNumber });
      const { phoneNumber } = response.data;
      console.log('Phone number fetched:', phoneNumber);
      return phoneNumber;
    } catch (error) {
      console.error('Error fetching phone number:', error);
      toast.error("Failed to fetch phone number.");
      return null;
    }
  };

  const handleAadharSubmit = async () => {
    setLoading(true);
    if (!validateAadharNumber(aadhar)) {
      setAadharError("Please enter a valid AADHAR Number");
      setLoading(false);
      return;
    }
    setAadharError("");
    const phoneNumber = await fetchPhoneNumber(aadhar);
    if (phoneNumber) {
      setPh("91" + phoneNumber);
      onSignup("91" + phoneNumber);
    } else {
      setLoading(false);
    }
  }

  function onSignup(ph) {
    console.log(ph);
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;
    let phn = "" + ph;
    phn = phn.substr(2);
    Cookies.set("phnumH", phn);

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        setValue({
          ...value,
          aadhar: aadhar
        });

        setTimeout(() => {
          navigate("/testresult");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const validateAadharNumber = (aadhar) => {
    const aadharPattern = /^\d{12}$/;
    // return aadharPattern.test(aadhar);
    return 1;
  };

  return (
    <div><button className="absolute mt-3 ml-3 rounded-lg bg-gray-700 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-gray-700 transition duration-100 hover:bg-gray-600 focus-visible:ring active:bg-gray-700 md:text-base"
    onClick={handleLogout}
>Back</button>
    <section className="bg-transparent flex items-center justify-center h-screen">
      <div>
      
        <div className="bg-white px-6 py-8 rounded-3xl shadow-xl shadow-gray-400 text-black w-full max-w-screen-lg mx-auto">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          {user ? (
            <h2 className="text-center text-black font-medium text-2xl">
              👍 User verified
            </h2>
          ) : (
            <div className="w-full flex flex-col gap-4 rounded-lg p-4">
              {showOTP ? (
                <>
                  <div className="bg-gray-700 text-white w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill className="" size={30} />
                  </div>
                  <label htmlFor="otp" className="font-bold text-xl text-gray-800 text-center">
                    Enter your OTP
                  </label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    className="opt-container w-fit flex justify-center items-center"
                  ></OtpInput>
                  <button
                    onClick={onOTPVerify}
                    className="rounded-lg bg-gray-700 px-5 py-2.5 flex gap-1 items-center justify-center text-sm font-medium text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                  >
                    {loading && (
                      <CgSpinner size={20} className="animate-spin" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-white text-gray-700 w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill className="text-black" size={30} />
                  </div>
                  <label htmlFor="aadhar" className="font-bold text-xl text-gray-800 text-center">
                    Verify your Aadhar number
                  </label>
                  <input
                    type="text"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value)}
                    placeholder="Enter Aadhar Number"
                    className={`block border w-full p-3 rounded mb-4 ${aadharError ? 'border-red-500' : 'border-grey-light'}`}
                  />
                  {aadharError && (
                    <p className="text-red-500 text-xs mt-1">
                      {aadharError}
                    </p>
                  )}
                  <button
                    onClick={handleAadharSubmit}
                    disabled={loading}
                    className="rounded-lg bg-gray-700 px-10 py-2.5 flex gap-1 items-center justify-center text-sm font-medium text-white outline-none ring-gray-300 transition duration-100 hover:bg-gray-700 focus-visible:ring active:bg-gray-600 md:text-base"
                  >
                    {loading && (
                      <CgSpinner size={20} className="animate-spin" />
                    )}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section></div>
  );
};

export default App;
