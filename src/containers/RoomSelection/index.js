import React from "react";
import { connect } from "react-redux";
import RoomsList from "./../../components/RoomsList";
import { dispatch } from "./../../store";
import { COOKIES } from "./../../constants"
import Cookies from "js-cookie";
import styles from "./RoomSelection.module.scss";

const RoomSelection = ({ rooms, onRoomSelected }) => {
  const getRoomsObjects = () =>
    Object.entries(rooms).map(([key, obj]) => ({
      id: key,
      name: obj.name
    }));

  const handleRoomSelection = roomId => {
    Cookies.set(COOKIES.SELECTED_ROOM_ID, roomId, { expires: 3650 });
    dispatch.app
      .setSelectedRoomId(roomId)
      .then(() => onRoomSelected && onRoomSelected(roomId));
  }

  const setDefaultPageType = pageType => Cookies.set(COOKIES.DEFAULT_PAGE_TYPE, pageType)

  return (
    <div className={styles.container}>
      <p className={styles.title}>Which room?</p>
      <div className={styles.items}>
        <RoomsList rooms={getRoomsObjects()} onClick={handleRoomSelection} />
      </div>
      <button onClick={() => setDefaultPageType("scenes")}>Scenes by default</button>
      <button onClick={() => setDefaultPageType("lights")}>Lights by default</button>
    </div>
  );
};

const mapState = state => ({
  rooms: state.rooms
});

export default connect(mapState)(RoomSelection);
