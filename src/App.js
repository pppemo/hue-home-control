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
import IdleMonitor from "react-simple-idle-monitor";
import { Carousel } from "react-responsive-carousel";
import styles from "./App.module.scss";

const SCREEN_SAVER_WAIT_TIME = 5000;

function App({
  isDataLoaded,
  isScreenSaverOn,
  enableScreenSaver,
  disableScreenSaver,
  isAnyLightOnInSelectedRoom,
  turnOnDefaultLights,
  selectedRoomId
}) {
  const [slideId, setSlideId] = useState(0);
  const [dataPollingInterval, setDataPollingInterval] = useState(null);

  useEffect(() => {
    dispatch.rooms.getRooms();
    dispatch.lights.getLights();
    createDataPollingInterval();
  }, []);

  const createDataPollingInterval = () => {
    const interval = setInterval(() => dispatch.lights.getLights(), 5000);
    setDataPollingInterval(interval);
  };

  const buildSlides = () => {
    const slides = [
      <RoomSelection
        key="RoomSelection"
        onRoomSelected={() => setSlideId(1)}
      />
    ];

    if (selectedRoomId) {
      slides.push(<RoomSwitches key="RoomSwitches" />);
    }
    return slides;
  };

  const onUserActive = () => {
    dispatch.lights.getLights();
    disableScreenSaver();
    createDataPollingInterval();
    selectedRoomId && turnOnDefaultLights();
  };

  const onUserIdle = () => {
    !isAnyLightOnInSelectedRoom && enableScreenSaver();
    clearInterval(dataPollingInterval);
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
      timeout={SCREEN_SAVER_WAIT_TIME}
      onIdle={onUserIdle}
      onActive={onUserActive}
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

const mapDispatch = ({ app, lights }) => ({
  enableScreenSaver: () => app.setIsScreenSaverOn(true),
  disableScreenSaver: () => app.setIsScreenSaverOn(false),
  turnOnDefaultLights: lights.turnOnDefaultLights
});

export default connect(
  mapState,
  mapDispatch
)(App);
