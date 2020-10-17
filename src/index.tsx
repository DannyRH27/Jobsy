import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const socket = new WebSocket("ws://localhost:3000");

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<App options={{ useSockets: true }} socket={socket} />, root);
});
