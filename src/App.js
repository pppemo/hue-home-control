import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import { dispatch } from "./store";
import styles from "./App.module.scss";

function App() {
  useEffect(() => {
    dispatch.rooms.getRooms();
  });

  return (
    <div className={styles.app}>
      <Switch>
        <Route path="/room/:roomId" component={RoomSwitches} />
        <Route path="/" component={RoomSelection} />
      </Switch>
    </div>
  );
}

export default App;
