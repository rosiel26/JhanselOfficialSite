
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Debug logging
console.log("[Debug] Main.jsx loaded");
console.log("[Debug] Checking if styles are loaded...");

// Check if styles are injected
setTimeout(() => {
  const styles = document.querySelectorAll("style[data-vite-dev-id]");
  console.log(`[Debug] Found ${styles.length} injected styles`);
  styles.forEach((style, i) => {
    console.log(
      `[Debug] Style ${i}: ${style.textContent.substring(0, 100)}...`,
    );
  });

  // Check if Tailwind classes are working
  const testElement = document.createElement("div");
  testElement.className = "bg-blue-500 text-white p-4";
  document.body.appendChild(testElement);
  const bgColor = window.getComputedStyle(testElement).backgroundColor;
  console.log(`[Debug] Tailwind bg-blue-500 computed color: ${bgColor}`);
  document.body.removeChild(testElement);
}, 1000);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
