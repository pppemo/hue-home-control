import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { isAnyLightOnInSelectedRoom } from "./store/selectors/lights";
import { Route, Switch } from "react-router";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import { dispatch } from "./store";
import Spinner from "./components/Spinner";
import { slide as Menu } from "react-burger-menu";
import styles from "./App.module.scss";

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom
}) {
  const [screenSaverTimeout, setScreenSaverTimeout] = useState(null);

  useEffect(() => {
    dispatch.rooms.getRooms();
    dispatch.lights.getLights();
  }, []);

  useEffect(() => {
    if (isAnyLightOnInSelectedRoom) {
      clearTimeout(screenSaverTimeout);
    } else {
      startScreenSaverTimer();
    }
  }, [isAnyLightOnInSelectedRoom]);

  const startScreenSaverTimer = () => {
    const SCREEN_SAVER_WAIT_TIME = 5000;
    clearTimeout(screenSaverTimeout);
    const timeout = setTimeout(enableScreenSaver, SCREEN_SAVER_WAIT_TIME);
    setScreenSaverTimeout(timeout);
  };

  const handleScreenSaverClick = () => {
    disableScreenSaver();
    startScreenSaverTimer();
  };

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
    <>
      <Menu
        width="100%"
        disableOverlayClick
        customBurgerIcon={false}
        customCrossIcon={false}
        isOpen={isScreenSaverOn}
        disableAutoFocus
      >
        <button
          className={styles.burgerMenuItem}
          onClick={handleScreenSaverClick}
        />
      </Menu>
      <div className={styles.app} onClick={startScreenSaverTimer}>
        <Switch>
          <Route path="/room/:roomId" component={RoomSwitches} />
          <Route path="/" component={RoomSelection} />
        </Switch>
      </div>
    </>
  );
}

const mapState = state => ({
  isDataLoaded: isDataLoaded(state),
  isScreenSaverOn: state.app.isScreenSaverOn,
  isAnyLightOnInSelectedRoom: isAnyLightOnInSelectedRoom(state)
});

const mapDispatch = ({ app }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false)
});

export default connect(
  mapState,
  mapDispatch
)(App);
