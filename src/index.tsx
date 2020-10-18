import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const socket = new WebSocket("ws://localhost:3000");

const options = {
  reconnectTimeout: 3000,
  maxReconnect: 5,
  enableHistory: false,
  useSockets: true,
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<App options={options} socket={socket} />, root);
});
