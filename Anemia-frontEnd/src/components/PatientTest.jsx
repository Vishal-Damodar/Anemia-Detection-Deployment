import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../MyContext";
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



const PatientTest = () => {
  const { value, setValue } = useMyContext();
  console.log("value", value);
  const [open, setOpen] = useState(false);

  const [detctions, setdetctions] = useState([])
  const [img, setimg] = useState(null);
  const navigate = useNavigate();
  const [params, setParams] = useState({
    lname: { value: "", valid: false, error: "" },
    fname: { value: "", valid: false, error: "" },
    aadhar: { value: "", valid: false, error: "" },
    phone: { value: "", valid: false, error: "" },
    city: { value: "", valid: false, error: "" },
    state: { value: "", valid: false, error: "" },
    gender: { value: "", valid: false, error: "" },
    nailImageData: { value: null, valid: false, error: "" },
  });

  const { logout } = useMyContext();

  const handleLogout = () => {
    // Call the logout function when the logout button is clicked
    logout();
  };

  const onSubmit = () => {
    const isValid = Object.values(params).every((field) => field.valid);

    if (!isValid) {
      // Update state to show error messages
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
      return;
    }
    const formData = {
      name: params.fname.value + params.lname.value,
      aadhar: params.aadhar.value,
      phone: params.phone.value,
      city: params.city.value,
      state: params.state.value,
      gender: params.gender.value,
      nailImageData: params.nailImageData.value,
      ashaEmail: value.user.email,
    };
    console.log("fromsm", formData);
    console.log("data", value);

    axios
      .post("http://a7db4c829af3f4f7985d8f62705bf031-1032979001.ap-south-1.elb.amazonaws.com:3006/asha_login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data?.success_msg) {
          // navigate("/testresult");
          setOpen(true);
          setimg(res.data.result.image);
          setdetctions(res.data.result.detections)
        } else toast.error("An error occured please try after some time");
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (field, value) => {
    console.log(params);
    if (
      field === "eyeImageData" ||
      field === "nailImageData" ||
      field === "tongueImageData"
    ) {
      if (!value) {
        setParams((prevParams) => ({
          ...prevParams,
          [field]: {
            value: null,
            valid: false,
            error: "Please select a file.",
          },
        }));
      } else {
        setParams((prevParams) => ({
          ...prevParams,
          [field]: { value: value, valid: true, error: "" },
        }));
      }
    } else {
      if (value.trim() === "") {
        setParams((prevParams) => ({
          ...prevParams,
          [field]: {
            value: value,
            valid: false,
            error: "This field is required.",
          },
        }));
      } else {
        setParams((prevParams) => ({
          ...prevParams,
          [field]: { value: value, valid: true, error: "" },
        }));
      }
    }
  };

  return (
    <React.Fragment>
      <Link
        type="button"
        to={"/ashadashboard"}
        class=" flex float-end mr-5 my-3 rounded-lg bg-indigo-500 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
      >
        View History
      </Link>
      <button className="relative mt-3 ml-3 rounded-lg bg-indigo-500 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"

  onClick={handleLogout}>Logout</button>
      <br />
      <div class="bg-transparent py-6 sm:py-8 lg:py-12">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div class="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div class="mb-10 md:mb-16">
            <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Test A Patient
            </h2>
          </div>
          <div className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
            <div>
              <label
                for="first-name"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                First name*
              </label>
              <input
                name="fname"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                type="text"
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.fname.valid && (
                <span className="text-red-500">{params.fname.error}</span>
              )}
            </div>

            <div>
              <label
                for="lname"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Last name*
              </label>
              <input
                name="lname"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.lname.valid && (
                <span className="text-red-500 text-sm">
                  {params.lname.error}
                </span>
              )}
            </div>

            <div>
              <label
                for="first-name"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Addhar Number*
              </label>
              <input
                name="aadhar"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.aadhar.valid && (
                <span className="text-red-500 text-sm">
                  {params.aadhar.error}
                </span>
              )}
            </div>

            <div>
              <label
                for="last-name"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Phone Number*
              </label>
              <input
                name="phone"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.phone.valid && (
                <span className="text-red-500 text-sm">
                  {params.phone.error}
                </span>
              )}
            </div>

            <div>
              <label
                for="first-name"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                City*
              </label>
              <input
                name="city"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.city.valid && (
                <span className="text-red-500 text-sm">
                  {params.city.error}
                </span>
              )}
            </div>

            <div>
              <label
                for="last-name"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                State*
              </label>
              <input
                name="state"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.state.valid && (
                <span className="text-red-500 text-sm">
                  {params.state.error}
                </span>
              )}
            </div>

            <div className="w-full rounded border px-3 py-2 text-gray-800  ">
              <span className="gap mr-6 mb-2 inline-block text-sm text-gray-800 sm:text-base ">
                Gender*
              </span>
              <label class="inline-flex items-center mr-6">
                <input
                  type="radio"
                  class="form-checkbox"
                  name="gender"
                  value="male"
                  checked={params.gender.value === "male"}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
                <span class="ml-2 text-gray-800">Male</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  class="  checked:text-black"
                  name="gender"
                  value="female"
                  checked={params.gender.value === "female"}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                />
                <span class="ml-2 text-gray-800">Female</span>
              </label>
              <br />
              {!params.gender.valid && (
                <span className="text-red-500 text-sm">
                  {params.gender.error}
                </span>
              )}
            </div>

            {/* <div class="sm:col-span-2">
              <label
                for="company"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Choose eye photo*
              </label>
              <input
                name="eyeImageData"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.files[0])
                }
                type="file"
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.eyeImageData.valid && (
                <span className="text-red-500 text-sm">
                  {params.eyeImageData.error}
                </span>
              )}
            </div> */}

            <div class="sm:col-span-2">
              <label
                for="email"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Choose nail photo*
              </label>
              <input
                name="nailImageData"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.files[0])
                }
                type="file"
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.nailImageData.valid && (
                <span className="text-red-500 text-sm">
                  {params.nailImageData.error}
                </span>
              )}
            </div>

            {/* <div class="sm:col-span-2">
              <label
                for="subject"
                class="mb-2 inline-block text-sm text-gray-800 sm:text-base"
              >
                Choose tongue photo*
              </label>
              <input
                name="tongueImageData"
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.files[0])
                }
                type="file"
                class="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              />
              {!params.tongueImageData.valid && (
                <span className="text-red-500 text-sm">
                  {params.tongueImageData.error}
                </span>
              )}
            </div> */}
            

            <div class="flex items-center justify-between sm:col-span-2">
            
              <Dialog>
                <DialogTrigger >
                  <button
                    onClick={() => onSubmit()}
                    variant="outline"
                    class="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                  >
                    test
                  </button>
                </DialogTrigger>
                {
                  open && (
                    <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Test Results</DialogTitle>
                    <DialogDescription>
                      the below is the results of the Patient
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    {
                      detctions && detctions.map((item) => {
                        return (
                          <div className="flex items-center justify-between sm:col-span-2">
                            <span>{item.class_name}</span><span>{item.confidence}</span>
                            </div>
                        )
                      })
                    }
                  </div>
                  <div className="flex items-center space-x-2">
                   { img && <img src={`data:image/png;base64,${img}`} alt="" />}
                  </div>

                  <DialogFooter className="sm:justify-start">
                    <DialogClose open>
                      <button type="button" onClick={() => setOpen(false)} variant="secondary" >
                        Close
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
                  )
                }
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div>
      
      {/* Your other component code */}
    </div>
    </React.Fragment>
  );
};

export default PatientTest;
