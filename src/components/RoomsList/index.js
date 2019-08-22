import React from "react";
import styles from "./RoomsList.module.scss";

export default ({ rooms, onClick }) => {
  return rooms.map(room => (
    <div key={room.id} onClick={() => onClick(room.id)} className={styles.item}>
      {room.name}
    </div>
  ));
};
