import Gateway from "./../gateway";

export default {
  state: null,
  reducers: {
    setLights: (_, payload) => payload
  },
  effects: dispatch => ({
    async getLights() {
      const rooms = await Gateway.getLightsInfo();
      dispatch.lights.setLights(rooms);
    }
  })
};
