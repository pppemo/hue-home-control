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
            ...newState
          }
        }
      };
    }
  },
  effects: dispatch => ({
    async getRooms() {
      const rooms = await Gateway.getRooms();
      dispatch.rooms.setRooms(rooms);
    },
    async setRoomState(roomState) {
      const { id, newState: state } = roomState;
      await Gateway.setGroupState(id, state);
      dispatch.rooms.setState({ id, state });
    },
    async turnOnDefaultSceneInSelectedRoom() {
      const {
        app: { defaultSceneId, selectedRoomId }
      } = store.getState();
      if (defaultSceneId) {
        const state = { scene: defaultSceneId };
        await Gateway.setGroupState(selectedRoomId, state);
        dispatch.rooms.setState({ id: selectedRoomId, state });
      }
    }
  })
};
