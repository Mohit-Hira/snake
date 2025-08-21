import { useState } from 'react'


import React from "react";
import SnakeGame from "./snakegame"; // Make sure the file is named SnakeGame.jsx

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h1>🐍 Snake Game</h1>
      <SnakeGame />
    </div>
  );
}

export default App;


