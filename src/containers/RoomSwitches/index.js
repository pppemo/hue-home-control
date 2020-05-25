import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import { PowerSettingsNew } from "@material-ui/icons";
import styles from "./RoomSwitches.module.scss";

const RoomSwitches = ({
  selectedRoomId,
  rooms,
  lights,
  setLightOn,
  setLightOff,
  config,
  turnOffLightsInSelectedRoom,
}) => {
  const roomLights = rooms[selectedRoomId].lights.map((id) => ({
    id,
    ...lights[id],
  }));

  const handleSwitchToggle = (lightId, state) => {
    dispatch.app.resetSelectedRoomSceneId();
    state ? setLightOn(lightId) : setLightOff(lightId);
  };

  const handleOffButton = () => {
    turnOffLightsInSelectedRoom().then(() => dispatch.lights.getLights());
  };

  return (
    <div className={styles.switchesContainer}>
      {roomLights.map((light) => (
        <Switch
          key={light.id}
          isOn={light.state.on}
          lightName={light.name}
          isDisabled={!light.state.reachable}
          onPress={(state) => handleSwitchToggle(light.id, state)}
          isSoundOn={config.isSoundOn}
        />
      ))}
      <Switch
        lightName={<PowerSettingsNew style={{ fontSize: 50 }} />}
        isStateless
        onPress={handleOffButton}
        isSoundOn={config.isSoundOn}
      />
    </div>
  );
};

const mapState = (state) => ({
  rooms: state.rooms,
  lights: state.lights,
  config: state.app.config,
  selectedRoomId: state.app.selectedRoomId,
});

const mapDispatch = ({ lights, rooms }) => ({
  setLightOn: (id) => lights.setLightState({ id, newState: { on: true } }),
  setLightOff: (id) => lights.setLightState({ id, newState: { on: false } }),
  turnOffLightsInSelectedRoom: () => rooms.turnOffLightsInSelectedRoom(),
});

export default connect(mapState, mapDispatch)(RoomSwitches);
