// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserProvider } from './contexts/UserContext'; // Ensure this import is correct

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
