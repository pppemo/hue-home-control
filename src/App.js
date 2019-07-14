import React from "react";
import Switch from "./components/Switch";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.switchesContainer}>
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
        <Switch />
      </div>
    </div>
  );
}

export default App;
