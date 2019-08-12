import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import styles from "./RoomSwitches.module.scss";

const RoomSwitches = ({
  selectedRoomId,
  rooms,
  lights,
  setLightOn,
  setLightOff
}) => {
  const roomLights = rooms[selectedRoomId].lights.map(id => ({
    id,
    ...lights[id]
  }));

  const handleSwitchToggle = (lightId, state) => {
    dispatch.app.resetSelectedRoomSceneId();
    state ? setLightOn(lightId) : setLightOff(lightId);
  };

  return (
    <div className={styles.switchesContainer}>
      {roomLights.map(light => (
        <Switch
          key={light.id}
          isOn={light.state.on}
          lightName={light.name}
          isDisabled={!light.state.reachable}
          onClick={state => handleSwitchToggle(light.id, state)}
        />
      ))}
    </div>
  );
};

const mapState = state => ({
  rooms: state.rooms,
  lights: state.lights,
  selectedRoomId: state.app.selectedRoomId
});

const mapDispatch = ({ lights }) => ({
  setLightOn: id => lights.setLightState({ id, newState: { on: true } }),
  setLightOff: id => lights.setLightState({ id, newState: { on: false } })
});

export default connect(
  mapState,
  mapDispatch
)(RoomSwitches);
