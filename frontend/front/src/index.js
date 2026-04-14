
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/global.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="486660592080-tcb4j6g0feshvhvgodauodspnj884mh4.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);