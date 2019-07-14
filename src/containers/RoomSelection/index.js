import React from "react";
import { connect } from "react-redux";
import RoomsList from "./../../components/RoomsList";
import styles from "./RoomSelection.module.scss";

const RoomSelection = ({ rooms, isLoadingAnything }) => {
  const getRoomsObjects = () =>
    Object.entries(rooms).map(([key, obj]) => ({
      id: key,
      name: obj.name
    }));

  return (
    <div className={styles.container}>
      <p className={styles.title}>Which room?</p>
      <div className={styles.items}>
        <RoomsList rooms={getRoomsObjects()} />
      </div>
    </div>
  );
};

const mapState = state => ({
  rooms: state.rooms
});

export default connect(mapState)(RoomSelection);
