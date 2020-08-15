import Gateway from "./../gateway";

export default {
  state: null,
  reducers: {
    setScenes: (_, payload) => payload,
  },
  effects: (dispatch) => ({
    async getScenes() {
      const scenesPromise = Gateway.getScenes();
      const scenes = await scenesPromise;
      dispatch.scenes.setScenes(scenes);
      return scenesPromise;
    },
  }),
};
