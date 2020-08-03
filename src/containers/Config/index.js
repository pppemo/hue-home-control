import React, { useState } from "react";
import { connect } from "react-redux";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Button, Box } from "@material-ui/core";
import { dispatch } from "./../../store";
import { ToggleButtonGroup, TextField, Switch } from "./../../components/UI";
import { COOKIES, CONFIG_KEYS } from "../../constants";
import Cookies from "js-cookie";
import styles from "./Config.module.scss";

const Config = ({
  setConfigParamInStorage,
  rooms,
  selectedRoomsIds,
  config,
}) => {
  const [shouldShowAdvancedOptions, setShouldShowAdvancedOptions] = useState(
    false
  );

  const [selectedRooms, setSelectedRooms] = useState(
    selectedRoomsIds?.reduce((acc, value) => ({ ...acc, [value]: true }), {}) ||
      {}
  );

  const storeSetting = (configKey, value) => {
    Cookies.set(`CONFIG_${configKey}`, value);
    setConfigParamInStorage(configKey, value);
  };

  const handleConfigActionTriggerSensorNameChange = (event) => {
    const { value } = event.target;
    const valueToStore = value && value !== "" ? value : undefined;
    storeSetting(CONFIG_KEYS.ACTION_TRIGGER_SENSOR_NAME, valueToStore);
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
        value={config[CONFIG_KEYS.DEFAULT_PAGE_TYPE]}
        exclusive
        onChange={(_, value) =>
          value && storeSetting(CONFIG_KEYS.DEFAULT_PAGE_TYPE, value)
        }
        aria-label="default return to screen"
      >
        <ToggleButton value="lights" aria-label="lights">
          Lights
        </ToggleButton>
        <ToggleButton value="scenes" aria-label="scenes">
          Scenes
        </ToggleButton>
      </ToggleButtonGroup>

      <div className={styles.configLabel}>Screensaver</div>
      <Switch
        checked={config[CONFIG_KEYS.SCREENSAVER_ON]}
        onChange={(_, value) => storeSetting(CONFIG_KEYS.SCREENSAVER_ON, value)}
        color="primary"
      />

      <Box className={styles.advancedOptionsContainer}>
        <Button
          variant="contained"
          onClick={() =>
            setShouldShowAdvancedOptions(!shouldShowAdvancedOptions)
          }
        >
          {shouldShowAdvancedOptions
            ? "Hide advanced options"
            : "Show advanced options"}
        </Button>

        {shouldShowAdvancedOptions && (
          <>
            <div className={styles.configLabel}>Click sounds</div>
            <Switch
              checked={config[CONFIG_KEYS.SOUNDS_ON]}
              onChange={(_, value) =>
                storeSetting(CONFIG_KEYS.SOUNDS_ON, value)
              }
              color="primary"
            />

            <div className={styles.configLabel}>
              Show room label on switches when multiple rooms selected
            </div>
            <Switch
              checked={config[CONFIG_KEYS.SHOULD_SHOW_ROOM_LABEL_ON_SWITCH]}
              onChange={(_, value) =>
                storeSetting(
                  CONFIG_KEYS.SHOULD_SHOW_ROOM_LABEL_ON_SWITCH,
                  value
                )
              }
              color="primary"
            />

            <div className={styles.configLabel}>
              When any action performed, trigger a flag in a virtual sensor
            </div>
            <TextField
              label="Sensor name"
              variant="filled"
              value={config[CONFIG_KEYS.ACTION_TRIGGER_SENSOR_NAME]}
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
  config: state.app.config,
});

const mapDispatch = ({ app }) => ({
  setConfigParamInStorage: (name, value) => app.setConfigParam({ name, value }),
});

export default connect(mapState, mapDispatch)(Config);
