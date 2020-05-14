import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { isAnyLightOnInSelectedRoom } from "./store/selectors/lights";
import { hasScenes } from "./store/selectors/scenes";
import Config from "./containers/Config";
import RoomSelection from "./containers/RoomSelection";
import RoomSwitches from "./containers/RoomSwitches";
import SceneSwitches from "./containers/SceneSwitches";
import { dispatch } from "./store";
import Spinner from "./components/Spinner";
import CarouselIndicator from "./components/CarouselIndicator";
import { slide as Menu } from "react-burger-menu";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import IdleMonitor from "react-simple-idle-monitor";
import { Carousel } from "react-responsive-carousel";
import { fullyApi } from "./helpers/fully";
import Bridge from "./helpers/bridge";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
import { COOKIES } from "./constants";
import styles from "./App.module.scss";

const SCREEN_SAVER_WAIT_TIME = 5000000000;
const BACK_TO_MAIN_SCREEN_TIME = 3500;
const CONFIG_SCREEN_ID = 0;
const ROOM_SELECTION_SCREEN_ID = 1;
const SCENES_SCREEN_ID = 2;
const LIGHTS_SCREEN_ID = 3;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom,
  turnOnDefaultSceneInSelectedRoom,
  selectedRoomId,
  hasScenes,
}) {
  const [idleMonitorTimeout, setIdleMonitorTimeout] = useState(
    SCREEN_SAVER_WAIT_TIME
  );
  const [slideId, setSlideId] = useState(
    selectedRoomId ? SCENES_SCREEN_ID : ROOM_SELECTION_SCREEN_ID
  );
  const [dataPollingInterval, setDataPollingInterval] = useState(null);

  useEffect(() => {
    if (Bridge.isBridgeDiscovered()) {
      dispatch.rooms.getRooms();
      dispatch.lights.getLights();
      dispatch.scenes.getScenes();
      dispatch.sensors.getSensors();
      createDataPollingInterval();
      fullyApi(
        "bind",
        "onMotion",
        'document.dispatchEvent(new KeyboardEvent("keydown"));'
      );
    }
  }, []);

  const createDataPollingInterval = () => {
    const interval = setInterval(() => dispatch.lights.getLights(), 10000);
    setDataPollingInterval(interval);
  };

  const buildSlides = () => {
    const slides = [
      <Config key="Config" />,
      <RoomSelection
        key="RoomSelection"
        onRoomSelected={() => setSlideId(SCENES_SCREEN_ID)}
      />,
    ];

    if (selectedRoomId) {
      hasScenes && slides.push(<SceneSwitches key="SceneSwitches" />);
      slides.push(<RoomSwitches key="RoomSwitches" />);
    }
    return slides;
  };

  const onUserActive = (event) => {
    const {
      event: { type },
    } = event;
    createDataPollingInterval();
    if (isScreenSaverOn) {
      selectedRoomId &&
        type === "touchstart" &&
        turnOnDefaultSceneInSelectedRoom().then(() =>
          dispatch.lights.getLights()
        );
      disableScreenSaver();
      fullyApi("setScreenBrightness", 64);
    }
  };

  const onUserIdle = () => {
    if (!isAnyLightOnInSelectedRoom) {
      enableScreenSaver();
      fullyApi("setScreenBrightness", 0);
      clearInterval(dataPollingInterval);
    }
  };

  if (!Bridge.isBridgeDiscovered()) {
    return (
      <div>
        No bridge is detected. Press a button on a bridge and then click
        "Continue".
        <button onClick={() => Bridge.createBridgeUser(nanoid())}>
          Continue
        </button>
      </div>
    );
  }

  if (!isDataLoaded) {
    return (
      <div className={styles.app}>
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      </div>
    );
  }

  const slides = buildSlides();

  return (
    <IdleMonitor
      timeout={BACK_TO_MAIN_SCREEN_TIME}
      onIdle={() =>
        Cookies.get(COOKIES.DEFAULT_PAGE_TYPE) === "lights"
          ? setSlideId(LIGHTS_SCREEN_ID)
          : setSlideId(SCENES_SCREEN_ID)
      }
    >
      <IdleMonitor
        timeout={idleMonitorTimeout}
        onIdle={onUserIdle}
        onActive={onUserActive}
        onStop={() => setIdleMonitorTimeout(0)}
        onRun={() => setIdleMonitorTimeout(SCREEN_SAVER_WAIT_TIME)}
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
            <CarouselIndicator
              className={styles.carouselIndicator}
              numberOfItems={slides.length}
              currentItemIndex={slideId}
            />
            <Carousel
              selectedItem={slideId}
              onChange={(id) => setSlideId(id)}
              showArrows={false}
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
            >
              {slides}
            </Carousel>
          </div>
        </>
      </IdleMonitor>
    </IdleMonitor>
  );
}

const mapState = (state) => ({
  isDataLoaded: isDataLoaded(state),
  isScreenSaverOn: state.app.isScreenSaverOn,
  isAnyLightOnInSelectedRoom: isAnyLightOnInSelectedRoom(state),
  selectedRoomId: state.app.selectedRoomId,
  hasScenes: hasScenes(state),
});

const mapDispatch = ({ app, rooms }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false),
  turnOnDefaultSceneInSelectedRoom: rooms.turnOnDefaultSceneInSelectedRoom,
});

export default connect(mapState, mapDispatch)(App);
