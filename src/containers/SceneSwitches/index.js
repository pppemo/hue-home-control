import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import { COOKIES } from "./../../constants";
import Cookies from "js-cookie";
import styles from "./SceneSwitches.module.scss";

const SceneSwitches = ({
  selectedRoomId,
  selectedRoomSceneId,
  defaultSceneId,
  scenes,
  recallScene
}) => {
  const scenesArray = Object.entries(scenes)
    .map(([key, props]) => ({
      id: key,
      ...props
    }))
    .filter(scene => scene.group === selectedRoomId && !scene.recycle);

  const handleSwitchToggle = sceneId =>
    recallScene(selectedRoomId, sceneId).then(() => {
      dispatch.app.setSelectedRoomSceneId(sceneId);
      dispatch.lights.getLights();
    });

  const handleSwitchLongPress = sceneId => {
    if (sceneId === defaultSceneId) {
      Cookies.remove(COOKIES.DEFAULT_SCENE_ID);
      dispatch.app.setDefaultSceneId(null);
    } else {
      Cookies.set(COOKIES.DEFAULT_SCENE_ID, sceneId, { expires: 3650 });
      dispatch.app.setDefaultSceneId(sceneId);
    }
  };

  return (
    <div className={styles.switchesContainer}>
      {scenesArray.map(scene => (
        <Switch
          isTurningOffDisabled
          key={scene.id}
          isFavourite={scene.id === defaultSceneId}
          isOn={scene.id === selectedRoomSceneId}
          lightName={scene.name}
          onPress={() => handleSwitchToggle(scene.id)}
          onLongPress={() => handleSwitchLongPress(scene.id)}
        />
      ))}
    </div>
  );
};

const mapState = state => ({
  scenes: state.scenes,
  selectedRoomId: state.app.selectedRoomId,
  defaultSceneId: state.app.defaultSceneId,
  selectedRoomSceneId: state.app.selectedRoomSceneId
});

const mapDispatch = ({ rooms }) => ({
  recallScene: (roomId, sceneId) =>
    rooms.setRoomState({ id: roomId, newState: { scene: sceneId } })
});

export default connect(
  mapState,
  mapDispatch
)(SceneSwitches);
