import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import { COOKIES } from "./../../constants";
import Cookies from "js-cookie";
import { PowerSettingsNew } from "@material-ui/icons";
import { CONFIG_KEYS } from "./../../constants";
import styles from "./SceneSwitches.module.scss";

const SceneSwitches = ({
  selectedRoomsIds,
  selectedRoomSceneId,
  defaultSceneId,
  scenes,
  rooms,
  recallScene,
  config,
  turnOffLightsInSelectedRooms,
}) => {
  const scenesArray = Object.entries(scenes)
    .map(([key, props]) => ({
      id: key,
      ...props,
    }))
    .filter((scene) => selectedRoomsIds.includes(scene.group) && !scene.recycle)
    .sort((sceneA, sceneB) => (sceneA.group <= sceneB.group ? -1 : 1));

  const handleSwitchToggle = (isOn, scene) => {
    if (isOn) {
      recallScene(scene.group, scene.id).then(() =>
        dispatch.app
          .setSelectedRoomSceneId(scene.id)
          .then(() => dispatch.lights.getLights())
      );
    } else {
      turnOffLightsInSelectedRooms().then(() => dispatch.lights.getLights());
    }
  };

  const handleSwitchLongPress = (sceneId) => {
    if (sceneId === defaultSceneId) {
      Cookies.remove(COOKIES.DEFAULT_SCENE_ID);
      dispatch.app.setDefaultSceneId(null);
    } else {
      Cookies.set(COOKIES.DEFAULT_SCENE_ID, sceneId, { expires: 3650 });
      dispatch.app.setDefaultSceneId(sceneId);
    }
  };

  const shouldShowAboveLabel =
    selectedRoomsIds.length > 1 &&
    config[CONFIG_KEYS.SHOULD_SHOW_ROOM_LABEL_ON_SWITCH];

  return (
    <div className={styles.switchesContainer}>
      {scenesArray.map((scene) => (
        <Switch
          key={scene.id}
          isFavourite={scene.id === defaultSceneId}
          isOn={scene.id === selectedRoomSceneId}
          aboveLabel={shouldShowAboveLabel && rooms[scene.group].name}
          lightName={scene.name}
          onPress={(isOn) => handleSwitchToggle(isOn, scene)}
          onLongPress={() => handleSwitchLongPress(scene.id)}
          isSoundOn={config[CONFIG_KEYS.SOUNDS_ON]}
        />
      ))}
      <Switch
        lightName={<PowerSettingsNew style={{ fontSize: 50 }} />}
        isStateless
        onPress={() => handleSwitchToggle(false)}
        isSoundOn={config[CONFIG_KEYS.SOUNDS_ON]}
      />
    </div>
  );
};

const mapState = (state) => ({
  scenes: state.scenes,
  rooms: state.rooms,
  selectedRoomsIds: state.app.selectedRoomsIds,
  defaultSceneId: state.app.defaultSceneId,
  config: state.app.config,
  selectedRoomSceneId: state.app.selectedRoomSceneId,
});

const mapDispatch = ({ rooms }) => ({
  recallScene: (roomId, sceneId) =>
    rooms.setRoomState({ id: roomId, newState: { scene: sceneId } }),
  turnOffLightsInSelectedRooms: () => rooms.turnOffLightsInSelectedRooms(),
});

export default connect(mapState, mapDispatch)(SceneSwitches);
