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
            ...newState
          }
        }
      };
    }
  },
  effects: dispatch => ({
    async getLights() {
      const rooms = await Gateway.getLightsInfo();
      dispatch.lights.setLights(rooms);
    },
    async setLightState(lightState) {
      const { id, newState: state } = lightState;
      await Gateway.setLightState(id, state);
      dispatch.lights.setState({ id, state });
    }
  })
};
