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

const SCREEN_SAVER_WAIT_TIME = 10000;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom,
  turnOnDefaultLights
}) {
  const [screenSaverTimeoutObject, setScreenSaverTimeoutObject] = useState(
    null
  );
  const [
    isScreenSaverTimeoutRunning,
    setIsScreenSaverTimeoutRunning
  ] = useState(false);

  useEffect(() => {
    dispatch.rooms.getRooms();
    dispatch.lights.getLights();
  }, []);

  useEffect(
    () =>
      isAnyLightOnInSelectedRoom
        ? clearScreenSaverTimeout()
        : setScreenSaverTimeout(),
    [isAnyLightOnInSelectedRoom]
  );

  const setScreenSaverTimeout = () => {
    clearTimeout(screenSaverTimeoutObject);
    setIsScreenSaverTimeoutRunning(true);
    const timeout = setTimeout(() => {
      enableScreenSaver();
      setIsScreenSaverTimeoutRunning(false);
    }, SCREEN_SAVER_WAIT_TIME);
    setScreenSaverTimeoutObject(timeout);
  };

  const clearScreenSaverTimeout = () => {
    clearTimeout(screenSaverTimeoutObject);
    setIsScreenSaverTimeoutRunning(false);
  };

  const onScreenClicked = () => {
    if (isScreenSaverTimeoutRunning) {
      setScreenSaverTimeout();
    }
  };

  const handleScreenSaverClick = () => {
    disableScreenSaver();
    setScreenSaverTimeout();
    turnOnDefaultLights();
  };

  const handleScreenSaverEscape = ({ isOpen }) => {
    if (!isOpen) {
      disableScreenSaver();
      setScreenSaverTimeout();
    }
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
        onStateChange={handleScreenSaverEscape}
        disableAutoFocus
      >
        <button
          className={styles.burgerMenuItem}
          onClick={handleScreenSaverClick}
        />
      </Menu>
      <div className={styles.app} onClick={onScreenClicked}>
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

const mapDispatch = ({ app, lights }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false),
  turnOnDefaultLights: lights.turnOnDefaultLights
});

export default connect(
  mapState,
  mapDispatch
)(App);
