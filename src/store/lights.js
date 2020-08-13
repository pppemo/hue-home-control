import Gateway from "./../gateway";
import store from "./../store";
import { MerkleJson } from "merkle-json";

export default {
  state: null,
  reducers: {
    setLights: (_, payload) => payload,
    setState: (state, payload) => {
      const { id, state: newState } = payload;
      const lightObject = state[id];

      return {
        ...state,
        [id]: {
          ...lightObject,
          state: {
            ...state[id].state,
            ...newState,
          },
        },
      };
    },
  },
  effects: (dispatch) => ({
    async getLights(shouldCheckForDifferences = false) {
      const rooms = await Gateway.getLightsInfo();

      if (shouldCheckForDifferences) {
        const { lights } = store.getState();

        const hash1 = new MerkleJson().hash(lights);
        const hash2 = new MerkleJson().hash(rooms);

        if (hash1 !== hash2) {
          dispatch.app.resetSelectedRoomSceneId();
        }
      }

      dispatch.lights.setLights(rooms);
    },
    async setLightState(lightState) {
      const { id, newState: state } = lightState;
      await Gateway.setLightState(id, state);
      await dispatch.sensors.handleLightActionTriggered();
      dispatch.lights.setState({ id, state });
    },
  }),
};
