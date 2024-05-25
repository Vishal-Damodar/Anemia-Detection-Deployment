import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1//04PAj3xArp0ggCgYIARAAGAQSNwF-L9Irr6OWwO7wPSh3mhk6RredXv9lD-BpCeQiBTV_wJlgtXjqe8qEis-2RPEjTnDYNAChiqc">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
