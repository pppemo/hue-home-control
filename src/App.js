import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import { isAnyLightOnInSelectedRooms } from "./store/selectors/lights";
import { hasScenes } from "./store/selectors/scenes";
import Config from "./containers/Config";
import RoomSwitches from "./containers/RoomSwitches";
import SceneSwitches from "./containers/SceneSwitches";
import { dispatch } from "./store";
import { Button } from "@material-ui/core";
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

const SCREEN_SAVER_WAIT_TIME = 8500;
const BACK_TO_MAIN_SCREEN_TIME = 5000;
const SETTINGS_SCREEN_ID = 0;
const SCENES_SCREEN_ID = 1;
const LIGHTS_SCREEN_ID = 2;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRooms,
  turnOnDefaultSceneInSelectedRoom,
  selectedRoomsIds,
  hasScenes,
  config,
}) {
  const [idleMonitorTimeout, setIdleMonitorTimeout] = useState(
    SCREEN_SAVER_WAIT_TIME
  );
  const [slideId, setSlideId] = useState(
    selectedRoomsIds ? SCENES_SCREEN_ID : SETTINGS_SCREEN_ID
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
    const slides = [<Config key="Config" />];

    if (!!selectedRoomsIds) {
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
      !!selectedRoomsIds &&
        type === "touchstart" &&
        turnOnDefaultSceneInSelectedRoom().then(() =>
          dispatch.lights.getLights()
        );
      disableScreenSaver();
      fullyApi("setScreenBrightness", 64);
      dispatch.sensors.handleLightActionTriggered();
    }
  };

  const onUserIdle = () => {
    if (!isAnyLightOnInSelectedRooms) {
      enableScreenSaver();
      fullyApi("setScreenBrightness", 0);
      clearInterval(dataPollingInterval);
    }
  };

  if (!Bridge.isBridgeDiscovered()) {
    return (
      <div className={styles.noBridgeContainer}>
        <div className={styles.helloLabel}>Hello!</div>
        <br />
        <br />
        We didn't detect any Hue bridge. In order to start:
        <br />
        <br />
        1. Press blue button on your bridge.
        <br />
        2. Click "Continue"
        <br />
        <br />
        <div>
          <Button
            className={styles.continueButton}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => Bridge.createBridgeUser(nanoid())}
          >
            Continue
          </Button>
        </div>
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
        config.defaultReturnToPage === "lights"
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
              swipeScrollTolerance={150}
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
  isAnyLightOnInSelectedRooms: isAnyLightOnInSelectedRooms(state),
  selectedRoomsIds: state.app.selectedRoomsIds,
  hasScenes: hasScenes(state),
  config: state.app.config,
});

const mapDispatch = ({ app, rooms }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false),
  turnOnDefaultSceneInSelectedRoom: rooms.turnOnDefaultSceneInSelectedRoom,
});

export default connect(mapState, mapDispatch)(App);
