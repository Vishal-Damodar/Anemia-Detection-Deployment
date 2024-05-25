import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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
      const response = await axios.post("http://localhost:3006/get-phone-number", { aadhar: aadharNumber });
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
    const phoneNumber = await fetchPhoneNumber(aadhar);
    if (phoneNumber) {
      setPh("91"+ phoneNumber);
      onSignup("91"+phoneNumber);
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
        toast.success("OTP sended successfully!");
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
          aadhar:aadhar
        })

        setTimeout(() => {
          navigate("/testresult");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="bg-transparent flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍User verified
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
                <label htmlFor="" className="font-bold text-xl text-gray-800 text-center">
                  Verify your Aadhar number
                </label>
                <input
                  type="text"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="Enter Aadhar Number"
                  className="block border border-grey-light w-full p-3 rounded mb-4"
                />
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
    </section>
  );
};

export default App;
