import React from "react";
import Switch from "./../../components/Switch"
import styles from "./RoomSwitches.module.scss"

const RoomSwitches = () => {
  return (
    <div className={styles.switchesContainer}>
      <Switch />
      <Switch />
      <Switch />
      <Switch />
      <Switch />
    </div>
  );
};

export default RoomSwitches;
