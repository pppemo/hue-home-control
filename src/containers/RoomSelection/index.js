import React from "react";
import RoomsList from "./../../components/RoomsList";
import styles from "./RoomSelection.module.scss";

export default () => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>Which room?</p>
      <div className={styles.items}>
        <RoomsList
          rooms={[
            {
              id: 1,
              name: "Salon"
            },
            {
              id: 2,
              name: "Living room"
            },
            {
              id: 3,
              name: "Salon"
            },
            {
              id: 4,
              name: "Living room"
            },
            {
              id: 5,
              name: "Salon"
            },
            {
              id: 6,
              name: "Living room"
            }
          ]}
        />
      </div>
    </div>
  );
};
