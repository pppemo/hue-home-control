import React from "react";
import { Route, Switch } from "react-router";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import Gateway from "./gateway";
import styles from "./App.module.scss";

Gateway.getLightsInfo();

function App() {
  return (
    <div className={styles.app}>
      <Switch>
        <Route path="/room/:roomId" component={RoomSwitches} />
        <Route path="/" component={RoomSelection}/>
      </Switch>
    </div>
  );
}

export default App;
