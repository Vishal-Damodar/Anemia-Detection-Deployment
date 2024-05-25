import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Step 1: Create a Context
const MyContext = createContext();

// Step 2: Create a Provider component
export const MyProvider = ({ children }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    user:"",
    email:"example@gnail.com",
    role:"Asha",
    aadhar:"",
  });

  const logout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    
    // Clear user information from context
    setValue({
      user: "",
      email: "",
      role: "",
      aadhar: ""
    });

    // Redirect to login page
    navigate('/');
  };

  return (
    <MyContext.Provider value={{ value, setValue, logout }}>
      {children}
    </MyContext.Provider>
  );
};
   

// Step 3: Consume the context using useContext hook
export const useMyContext = () => useContext(MyContext);