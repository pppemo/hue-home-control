import React from "react";
import { connect } from "react-redux";
import { dispatch } from "./../../store";
import Switch from "./../../components/Switch";
import styles from "./SceneSwitches.module.scss";

const SceneSwitches = ({
  selectedRoomId,
  selectedRoomSceneId,
  scenes,
  recallScene
}) => {
  const scenesArray = Object.entries(scenes)
    .map(([key, props]) => ({
      key,
      id: key,
      ...props
    }))
    .filter(scene => scene.group === selectedRoomId && !scene.recycle);

  const handleSwitchToggle = sceneId =>
    recallScene(selectedRoomId, sceneId).then(() => {
      dispatch.app.setSelectedRoomSceneId(sceneId);
      dispatch.lights.getLights();
    });

  return (
    <div className={styles.switchesContainer}>
      {scenesArray.map(scene => (
        <Switch
          isTurningOffDisabled
          key={scene.id}
          isOn={scene.id === selectedRoomSceneId}
          lightName={scene.name}
          onClick={() => handleSwitchToggle(scene.id)}
        />
      ))}
    </div>
  );
};

const mapState = state => ({
  scenes: state.scenes,
  selectedRoomId: state.app.selectedRoomId,
  selectedRoomSceneId: state.app.selectedRoomSceneId
});

const mapDispatch = ({ rooms }) => ({
  recallScene: (roomId, sceneId) =>
    rooms.setRoomState({ roomId, newState: { scene: sceneId } })
});

export default connect(
  mapState,
  mapDispatch
)(SceneSwitches);
