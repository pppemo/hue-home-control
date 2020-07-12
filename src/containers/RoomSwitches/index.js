import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import { PowerSettingsNew } from "@material-ui/icons";
import styles from "./RoomSwitches.module.scss";

const RoomSwitches = ({
  selectedRoomsIds,
  rooms,
  lights,
  setLightOn,
  setLightOff,
  config,
  turnOffLightsInSelectedRooms,
}) => {
  const roomsLights = selectedRoomsIds
    ?.reduce((acc, value) => [...acc, ...rooms[value]?.lights], [])
    .map((id) => ({
      id,
      ...lights[id],
      roomName: Object.values(rooms).find((room) => room.lights.includes(id))
        .name,
    }));

  const handleSwitchToggle = (lightId, state) => {
    dispatch.app.resetSelectedRoomSceneId();
    state ? setLightOn(lightId) : setLightOff(lightId);
  };

  const handleOffButton = () => {
    turnOffLightsInSelectedRooms().then(() => dispatch.lights.getLights());
  };

  return (
    <div className={styles.switchesContainer}>
      {roomsLights.map((light) => (
        <Switch
          key={light.id}
          isOn={light.state.on}
          aboveLabel={selectedRoomsIds.length > 1 && light.roomName}
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
  selectedRoomsIds: state.app.selectedRoomsIds,
});

const mapDispatch = ({ lights, rooms }) => ({
  setLightOn: (id) => lights.setLightState({ id, newState: { on: true } }),
  setLightOff: (id) => lights.setLightState({ id, newState: { on: false } }),
  turnOffLightsInSelectedRooms: () => rooms.turnOffLightsInSelectedRooms(),
});

export default connect(mapState, mapDispatch)(RoomSwitches);
