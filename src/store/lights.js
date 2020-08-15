import Gateway from "./../gateway";

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
    async getLights() {
      const lightsPromise = Gateway.getLightsInfo();
      const lights = await lightsPromise;
      dispatch.lights.setLights(lights);
      return lightsPromise;
    },
    async setLightState(lightState) {
      const { id, newState: state } = lightState;
      await Gateway.setLightState(id, state);
      await dispatch.sensors.handleLightActionTriggered();
      dispatch.lights.setState({ id, state });
    },
  }),
};
