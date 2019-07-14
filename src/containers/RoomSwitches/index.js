import React from "react";
import { connect } from "react-redux";
import Switch from "./../../components/Switch";
import styles from "./RoomSwitches.module.scss";

const RoomSwitches = ({ match, rooms, lights, isLoadingAnything }) => {
  const { roomId } = match.params;
  const roomLights = rooms[roomId].lights.map(id => ({
    id,
    ...lights[id]
  }));

  return (
    <div className={styles.switchesContainer}>
      {roomLights.map(light => (
        <Switch key={light.id} lightId={light.id} lightName={light.name} />
      ))}
    </div>
  );
};

const mapState = state => ({
  rooms: state.rooms,
  lights: state.lights
});

export default connect(mapState)(RoomSwitches);
