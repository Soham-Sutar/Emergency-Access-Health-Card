import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Web3Provider } from "@/hooks/useWeb3";
import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);