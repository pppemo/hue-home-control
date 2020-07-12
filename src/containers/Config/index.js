import React, { useState } from "react";
import { connect } from "react-redux";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Button, Box } from "@material-ui/core";
import { dispatch } from "./../../store";
import { ToggleButtonGroup, TextField, Switch } from "./../../components/UI";
import { COOKIES } from "../../constants";
import Cookies from "js-cookie";
import styles from "./Config.module.scss";

const Config = ({ setConfigParamInStorage, rooms, selectedRoomsIds }) => {
  const [defaultReturnToPage, setDefaultReturnToPage] = useState(
    Cookies.get(COOKIES.DEFAULT_PAGE_TYPE) || "scenes"
  );
  const [
    configActionTriggerSensorName,
    setConfigActionTriggerSensorName,
  ] = useState(Cookies.get(COOKIES.CONFIG_ACTION_TRIGGER_SENSOR_NAME));
  const [shouldShowAdvancedOptions, setShouldShowAdvancedOptions] = useState(
    false
  );
  const [soundsOn, setSoundsOn] = useState(
    Cookies.get(COOKIES.CONFIG_SOUNDS_ON) === "false" ? false : true
  );
  const [selectedRooms, setSelectedRooms] = useState(
    selectedRoomsIds?.reduce((acc, value) => ({ ...acc, [value]: true }), {}) ||
      {}
  );

  const setDefaultPageType = (_, pageType) => {
    if (pageType) {
      Cookies.set(COOKIES.DEFAULT_PAGE_TYPE, pageType);
      setDefaultReturnToPage(pageType);
    }
  };

  const handleShowAdvancedOptionsButton = () =>
    setShouldShowAdvancedOptions(!shouldShowAdvancedOptions);

  const handleConfigActionTriggerSensorNameChange = (event) => {
    const { value } = event.target;
    setConfigActionTriggerSensorName(value);
    Cookies.set(COOKIES.CONFIG_ACTION_TRIGGER_SENSOR_NAME, value);
    setConfigParamInStorage("actionTriggerSensorName", value);
  };

  const handleSoundsOnSwitch = (_, soundsOn) => {
    setSoundsOn(soundsOn);
    Cookies.set(COOKIES.CONFIG_SOUNDS_ON, soundsOn);
    setConfigParamInStorage("isSoundOn", soundsOn);
  };

  const toggleSelectedRoom = (id, value) => {
    const selectedRoomsObject = {
      ...selectedRooms,
      [id]: value,
    };

    const selectedRoomsIds = Object.entries(selectedRoomsObject)
      .filter((entry) => entry[1])
      .map(([id, _]) => id);

    if (!selectedRoomsIds.length && !value) {
      return;
    }

    setSelectedRooms(selectedRoomsObject);
    dispatch.app.setSelectedRoomsIds(selectedRoomsIds);
    Cookies.set(COOKIES.SELECTED_ROOMS_IDS, selectedRoomsIds.join(","));
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Settings</p>

      <div className={styles.configLabel}>Rooms</div>
      <div className={styles.roomsSelectionButtons}>
        {Object.entries(rooms).map(([id, room]) => (
          <Button
            key={room.name}
            color="primary"
            variant={selectedRooms[id] ? "contained" : "outlined"}
            onClick={() => toggleSelectedRoom(id, !selectedRooms[id])}
            disableElevation
            size="large"
          >
            {room.name}
          </Button>
        ))}
      </div>

      <div className={styles.configLabel}>Default "return to" page</div>
      <ToggleButtonGroup
        value={defaultReturnToPage}
        exclusive
        onChange={setDefaultPageType}
        aria-label="default return to screen"
      >
        <ToggleButton value="lights" aria-label="lights">
          Lights
        </ToggleButton>
        <ToggleButton value="scenes" aria-label="scenes">
          Scenes
        </ToggleButton>
      </ToggleButtonGroup>

      <Box className={styles.advancedOptionsContainer}>
        <Button variant="contained" onClick={handleShowAdvancedOptionsButton}>
          {shouldShowAdvancedOptions
            ? "Hide advanced options"
            : "Show advanced options"}
        </Button>

        {shouldShowAdvancedOptions && (
          <>
            <div className={styles.configLabel}>Click sounds</div>
            <Switch
              checked={soundsOn}
              onChange={handleSoundsOnSwitch}
              color="primary"
            />

            <div className={styles.configLabel}>
              When any action performed, trigger a flag in a virtual sensor
            </div>
            <TextField
              label="Sensor name"
              variant="filled"
              value={configActionTriggerSensorName}
              onChange={handleConfigActionTriggerSensorNameChange}
            />
          </>
        )}
      </Box>
    </div>
  );
};

const mapState = (state) => ({
  rooms: state.rooms,
  selectedRoomsIds: state.app.selectedRoomsIds,
});

const mapDispatch = ({ app }) => ({
  setConfigParamInStorage: (name, value) => app.setConfigParam({ name, value }),
});

export default connect(mapState, mapDispatch)(Config);
