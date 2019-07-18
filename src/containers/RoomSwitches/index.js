import React, { useEffect } from "react";
import { connect } from "react-redux";
import Switch from "./../../components/Switch";
import { dispatch } from "./../../store";
import styles from "./RoomSwitches.module.scss";

const RoomSwitches = ({ match, rooms, lights, setLightOn, setLightOff }) => {
  const { roomId } = match.params;

  useEffect(() => {
    dispatch.app.setSelectedRoomId(roomId);
  }, []);

  const roomLights = rooms[roomId].lights.map(id => ({
    id,
    ...lights[id]
  }));

  const handleSwitchToggle = (lightId, state) =>
    state ? setLightOn(lightId) : setLightOff(lightId);

  return (
    <div className={styles.switchesContainer}>
      {roomLights.map(light => (
        <Switch
          key={light.id}
          isOn={light.state.on}
          lightId={light.id}
          lightName={light.name}
          onClick={state => handleSwitchToggle(light.id, state)}
        />
      ))}
    </div>
  );
};

const mapState = state => ({
  rooms: state.rooms,
  lights: state.lights
});

const mapDispatch = ({ lights }) => ({
  setLightOn: id => lights.setLightState({ id, newState: { on: true } }),
  setLightOff: id => lights.setLightState({ id, newState: { on: false } })
});

export default connect(
  mapState,
  mapDispatch
)(RoomSwitches);
