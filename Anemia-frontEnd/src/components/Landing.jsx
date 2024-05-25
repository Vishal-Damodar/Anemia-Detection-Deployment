import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Assuming you have a CSS file for styling

const Landing = () => {
  return (
    <div className="landing-page-container">
      <div className="top-right-buttons">
        <Link className="login-button" to="login">
          LogIn
        </Link>
        <Link className="signup-button" to="Signup">
          SignUp
        </Link>
      </div>
      <div className="content-container">
        <header className="text-center">
          <h1 className="main-heading">Anemia Detection Made Easy</h1>
          <p className="sub-heading">
            Take control of your health today with our simple and accurate anemia detection tool.
          </p>
          <div className="cta-buttons">
            <Link className="primary-button" to="/selfTest">
              Take a Test
            </Link>
            <Link className="secondary-button" to="/results">
              Get Your Result
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Landing;
