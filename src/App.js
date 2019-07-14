import React, { useEffect } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { Route, Switch } from "react-router";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import { dispatch } from "./store";
import Spinner from "./components/Spinner";
import styles from "./App.module.scss";

function App({ isDataLoaded }) {
  useEffect(() => {
    dispatch.rooms.getRooms();
    dispatch.lights.getLights();
  });

  if (!isDataLoaded) {
    return (
      <div className={styles.app}>
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Switch>
        <Route path="/room/:roomId" component={RoomSwitches} />
        <Route path="/" component={RoomSelection} />
      </Switch>
    </div>
  );
}

const mapState = state => ({
  isDataLoaded: isDataLoaded(state)
});

export default connect(mapState)(App);
