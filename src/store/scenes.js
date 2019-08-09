import Gateway from "./../gateway";

export default {
  state: null,
  reducers: {
    setScenes: (_, payload) => payload
  },
  effects: dispatch => ({
    async getScenes() {
      const scenes = await Gateway.getScenes();
      dispatch.scenes.setScenes(scenes);
    }
  })
};
