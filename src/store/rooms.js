import Gateway from "./../gateway";
import store from "./../store";

export default {
  state: null,
  reducers: {
    setRooms: (_, payload) => payload,
    setState: (state, payload) => {
      const { id, state: newState } = payload;
      const groupObject = state[id];

      return {
        ...state,
        [id]: {
          ...groupObject,
          state: {
            ...state[id].state,
            ...newState,
          },
        },
      };
    },
  },
  effects: (dispatch) => ({
    async getRooms() {
      const roomsPromise = Gateway.getRooms();
      const rooms = await roomsPromise;
      dispatch.rooms.setRooms(rooms);
      return roomsPromise;
    },
    async setRoomState(roomState) {
      const { id, newState: state } = roomState;
      await Gateway.setGroupState(id, state);
      await dispatch.sensors.handleLightActionTriggered();
      dispatch.rooms.setState({ id, state });
    },
    async turnOffLightsInSelectedRooms() {
      const {
        app: { selectedRoomsIds },
      } = store.getState();
      selectedRoomsIds.forEach(async (selectedRoomId) => {
        await Gateway.setGroupState(selectedRoomId, { on: false });
        await dispatch.sensors.handleLightActionTriggered();
        dispatch.rooms.setState({ id: selectedRoomId, state: { on: false } });
        dispatch.app.setSelectedRoomSceneId(null);
      });
    },
    async turnOnDefaultSceneInSelectedRoom() {
      const {
        app: { defaultSceneId, selectedRoomId },
      } = store.getState();
      if (defaultSceneId) {
        const state = { scene: defaultSceneId };
        await Gateway.setGroupState(selectedRoomId, state);
        await dispatch.sensors.handleLightActionTriggered();
        dispatch.rooms.setState({ id: selectedRoomId, state });
        dispatch.app.setSelectedRoomSceneId(defaultSceneId);
      }
    },
  }),
};
