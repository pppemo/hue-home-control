import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isDataLoaded } from "./store/selectors/global";
import {
  isAnyLightOnInSelectedRoomsSelector,
  lightsIdsOfSelectedRoomsSelector,
} from "./store/selectors/lights";
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
import { CONFIG_KEYS } from "./constants";
import styles from "./App.module.scss";
import DataPoller from "./gateway/dataPoller";
import ResponseHistoryComparator from "./gateway/responseHistoryComparator";

const SCREEN_SAVER_WAIT_TIME = 8500;
const BACK_TO_MAIN_SCREEN_TIME = 5000;
const DATA_POLLING_INTERVAL = 5000;
const SETTINGS_SCREEN_ID = 0;
const SCENES_SCREEN_ID = 1;
const LIGHTS_SCREEN_ID = 2;

export const lightsDataPoller = new DataPoller(
  () => dispatch.lights.getLights(),
  DATA_POLLING_INTERVAL
);

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRooms,
  lightsIdsOfSelectedRooms,
  turnOnDefaultSceneInSelectedRoom,
  selectedRoomsIds,
  hasScenes,
  config,
}) {
  const getDefaultScreenId = () =>
    config[CONFIG_KEYS.DEFAULT_PAGE_TYPE] === "lights"
      ? LIGHTS_SCREEN_ID
      : SCENES_SCREEN_ID;

  const [idleMonitorTimeout, setIdleMonitorTimeout] = useState(
    SCREEN_SAVER_WAIT_TIME
  );

  const [isUserIdle, setIsUserIdle] = useState(false);

  const [slideId, setSlideId] = useState(
    selectedRoomsIds ? getDefaultScreenId() : SETTINGS_SCREEN_ID
  );

  useEffect(async () => {
    if (Bridge.isBridgeDiscovered()) {
      dispatch.lights.getLights();
      dispatch.rooms.getRooms();
      dispatch.scenes.getScenes();
      dispatch.sensors.getSensors();
      fullyApi(
        "bind",
        "onMotion",
        'document.dispatchEvent(new KeyboardEvent("keydown"));'
      );
    }
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      lightsDataPoller.setResponseHistoryComparator(
        new ResponseHistoryComparator()
          .setExtractDataFn((data) =>
            Object.entries(data)
              .map(([key, value]) => ({ id: key, ...value }))
              .filter(
                (entry) =>
                  lightsIdsOfSelectedRooms &&
                  lightsIdsOfSelectedRooms.includes(entry.id)
              )
              .map((entry) => entry.state.on)
          )
          .setOnStateChangeFn(() => dispatch.app.resetSelectedRoomSceneId())
      );
      lightsDataPoller.start(false);
    }
  }, [isDataLoaded]);

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
    if (isScreenSaverOn) {
      !!selectedRoomsIds &&
        type === "touchstart" &&
        turnOnDefaultSceneInSelectedRoom().then(() => lightsDataPoller.start());
      disableScreenSaver();
      fullyApi("setScreenBrightness", 64);
      dispatch.sensors.handleLightActionTriggered();
    }
    setIsUserIdle(false);
  };

  const onUserIdle = () => {
    if (config[CONFIG_KEYS.SCREENSAVER_ON] && !isAnyLightOnInSelectedRooms) {
      enableScreenSaver();
      fullyApi("setScreenBrightness", 0);
      lightsDataPoller.stop();
    }
    setIsUserIdle(true);
  };

  useEffect(() => {
    isDataLoaded &&
      isUserIdle &&
      !isAnyLightOnInSelectedRooms &&
      !isScreenSaverOn &&
      onUserIdle();
  }, [isAnyLightOnInSelectedRooms]);

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
      onIdle={() => setSlideId(getDefaultScreenId())}
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
  isAnyLightOnInSelectedRooms: isAnyLightOnInSelectedRoomsSelector(state),
  lightsIdsOfSelectedRooms: lightsIdsOfSelectedRoomsSelector(state),
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
