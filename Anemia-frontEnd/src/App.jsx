import { useState } from "react";
// import Navbar from "./components/Navbar";
import "./App.css";
import Login from "./components/login";
import OnSignup from "./components/OnSingup";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Landing from "./components/Landing";
import Userlogin from "./components/Userlogin";
import Dash from "./components/Dash";
import Signup from "./components/signup";
import { MyProvider } from './MyContext';
import PatientTest from "./components/PatientTest";
import AshaDashboard from "./components/AshaDashboard";
import TestResult from "./components/TestResult";
import SelfTest from "./components/SelfTest";
import ForgotPassword from "./components/ForgotPassword";
import SuccessRedirect from "./components/SuccessRedirect";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
      <MyProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="userlogin" element={<Userlogin />} />
          <Route path="results" element={<OnSignup />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="Dash" element={<Dash/>}/>
          <Route path="patient" element={<PatientTest/>} />
          <Route path="ashadashboard" element={<AshaDashboard/>}/>
          <Route path="testresult" element={<TestResult/>}/>
          <Route path="selfTest" element={<SelfTest/>}/>
          <Route path="forgot" element={<ForgotPassword/>}/>
          <Route path="/auth/activate/:token" element={<SuccessRedirect/>} />
        </Routes>
        </MyProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
