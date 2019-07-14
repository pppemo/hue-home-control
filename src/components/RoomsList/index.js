import React from "react";
import { Link } from "react-router-dom";
import styles from "./RoomsList.module.scss";

console.log('styles', styles)

export default ({ rooms }) => {
  return rooms.map(room => (
    <Link key={room.key} to={`/room/${room.id}`}>
      <div className={styles.item}>{room.name}</div>
    </Link>
  ));
};
