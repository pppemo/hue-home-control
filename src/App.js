import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { isAnyLightOnInSelectedRoom } from "./store/selectors/lights";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import SceneSwitches from "./containers/SceneSwitches";
import { dispatch } from "./store";
import Spinner from "./components/Spinner";
import { slide as Menu } from "react-burger-menu";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import IdleMonitor from "react-simple-idle-monitor";
import { Carousel } from "react-responsive-carousel";
import { fullyApi } from "./helpers/fully";
import styles from "./App.module.scss";

const SCREEN_SAVER_WAIT_TIME = 5000;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom,
  turnOnDefaultSceneInSelectedRoom,
  selectedRoomId
}) {
  const [idleMonitorTimeout, setIdleMonitorTimeout] = useState(
    SCREEN_SAVER_WAIT_TIME
  );
  const [isIdleMonitorActive, setIsIdleMonitorActive] = useState(true);
  const [slideId, setSlideId] = useState(selectedRoomId ? 1 : 0);
  const [dataPollingInterval, setDataPollingInterval] = useState(null);

  useEffect(() => {
    dispatch.rooms.getRooms();
    dispatch.lights.getLights();
    dispatch.scenes.getScenes();
    createDataPollingInterval();
    fullyApi(
      "bind",
      "onMotion",
      'document.dispatchEvent(new KeyboardEvent("keydown"));'
    );
  }, []);

  useEffect(() => {
    setIsIdleMonitorActive(!isAnyLightOnInSelectedRoom);
  }, [isAnyLightOnInSelectedRoom]);

  const createDataPollingInterval = () => {
    const interval = setInterval(() => dispatch.lights.getLights(), 5000);
    setDataPollingInterval(interval);
  };

  const buildSlides = () => {
    const slides = [
      <RoomSelection key="RoomSelection" onRoomSelected={() => setSlideId(1)} />
    ];

    if (selectedRoomId) {
      slides.push(<RoomSwitches key="RoomSwitches" />);
      slides.push(<SceneSwitches key="SceneSwitches" />);
    }
    return slides;
  };

  const onUserActive = event => {
    const {
      event: { type }
    } = event;
    createDataPollingInterval();
    if (isScreenSaverOn) {
      selectedRoomId &&
        type === "touchstart" &&
        turnOnDefaultSceneInSelectedRoom().then(() => dispatch.lights.getLights());
      disableScreenSaver();
      fullyApi("setScreenBrightness", 128);
    }
  };

  const onUserIdle = () => {
    if (!isAnyLightOnInSelectedRoom) {
      enableScreenSaver();
      fullyApi("setScreenBrightness", 0);
      clearInterval(dataPollingInterval);
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
    <IdleMonitor
      timeout={idleMonitorTimeout}
      onIdle={onUserIdle}
      onActive={onUserActive}
      onStop={() => setIdleMonitorTimeout(0)}
      onRun={() => setIdleMonitorTimeout(SCREEN_SAVER_WAIT_TIME)}
      enabled={isIdleMonitorActive}
    >
      <>
        <Menu
          width="100%"
          disableOverlayClick
          customBurgerIcon={false}
          customCrossIcon={false}
          isOpen={isScreenSaverOn}
          disableAutoFocus
        >
          <div className={styles.burgerMenuItem} />
        </Menu>
        <div className={styles.app}>
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
    </IdleMonitor>
  );
}

const mapState = state => ({
  isDataLoaded: isDataLoaded(state),
  isScreenSaverOn: state.app.isScreenSaverOn,
  isAnyLightOnInSelectedRoom: isAnyLightOnInSelectedRoom(state),
  selectedRoomId: state.app.selectedRoomId
});

const mapDispatch = ({ app, rooms }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false),
  turnOnDefaultSceneInSelectedRoom: rooms.turnOnDefaultSceneInSelectedRoom
});

export default connect(
  mapState,
  mapDispatch
)(App);
