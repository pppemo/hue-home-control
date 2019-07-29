import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { isAnyLightOnInSelectedRoom } from "./store/selectors/lights";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import { dispatch } from "./store";
import Spinner from "./components/Spinner";
import { slide as Menu } from "react-burger-menu";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import styles from "./App.module.scss";

const SCREEN_SAVER_WAIT_TIME = 10000;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom,
  turnOnDefaultLights,
  selectedRoomId
}) {
  const [screenSaverTimeoutObject, setScreenSaverTimeoutObject] = useState(
    null
  );

  const [slideId, setSlideId] = useState(0);

  const [
    isScreenSaverTimeoutRunning,
    setIsScreenSaverTimeoutRunning
  ] = useState(false);

  useEffect(() => {
    dispatch.rooms.getRooms();
    setGetLightsTimeout();
  }, []);

  useEffect(
    () =>
      isAnyLightOnInSelectedRoom
        ? clearScreenSaverTimeout()
        : setScreenSaverTimeout(),
    [isAnyLightOnInSelectedRoom]
  );

  const setGetLightsTimeout = () => {
    dispatch.lights.getLights();
    setTimeout(setGetLightsTimeout, 5000);
  };

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

  const buildSlides = () => {
    const slides = [
      <RoomSelection key="RoomSelection" onRoomSelected={() => setSlideId(1)} />
    ];

    if (selectedRoomId) {
      slides.push(<RoomSwitches key="RoomSwitches" />);
    }
    return slides;
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
        <Carousel
          selectedItem={slideId}
          onChange={id => setSlideId(id)}
          showArrows={false}
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
        >
          {buildSlides()}
        </Carousel>
      </div>
    </>
  );
}

const mapState = state => ({
  isDataLoaded: isDataLoaded(state),
  isScreenSaverOn: state.app.isScreenSaverOn,
  isAnyLightOnInSelectedRoom: isAnyLightOnInSelectedRoom(state),
  selectedRoomId: state.app.selectedRoomId
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
