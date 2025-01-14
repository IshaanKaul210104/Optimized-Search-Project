import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Your main app component
import { AppProvider } from "./Context/AppContext"; // Import AppProvider

// Create the root and wrap App in AppProvider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);
