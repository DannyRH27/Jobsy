import React from "react";
import ReactDOM from "react-dom";
import ReactBotkit from "./App";

const options = {
  wsUrl:
    (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host,
  reconnectTimeout: 3000,
  maxReconnect: 5,
  enableHistory: false,
  useSockets: true,
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<ReactBotkit options={options} />, root);
});
