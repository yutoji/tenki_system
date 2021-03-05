import React from "react";
import "./App.css";
import TenkiSystemAlpha from "./TenkiSystemAlpha";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>今日の天気</div>
        <img src="/top.gif" alt="ロゴ" />
        <TenkiSystemAlpha type="country" />
        <TenkiSystemAlpha type="prefecture" />
      </header>
    </div>
  );
}

export default App;
