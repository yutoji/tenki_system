import React from "react";
import "./App.css";
import CountryTenkiSystemClient from "./tenkiClients/CountryTenkiSystemClient";
import TenkiSystemBeta from "./tenkiSystem/TenkiSystemBeta";
import TenkiSystemAlpha from "./TenkiSystemAlpha";
import PrefectureTenkiSystemClient from "./tenkiClients/PrefectureTenkiSystemClient";
import MockTenkiSystemClient from "./tenkiClients/MockTenkiSystemClient";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>今日の天気</div>
        <img src="/top.gif" alt="ロゴ" />
        <h2>Alpha System(Legacy)</h2>
        <TenkiSystemAlpha type="country" />
        <TenkiSystemAlpha type="prefecture" />
        <h2>Beta System(DDD)</h2>
        <TenkiSystemBeta client={CountryTenkiSystemClient} />
        <TenkiSystemBeta client={PrefectureTenkiSystemClient} />
        <TenkiSystemBeta client={MockTenkiSystemClient} />
      </header>
    </div>
  );
}

export default App;
