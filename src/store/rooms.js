import Gateway from "./../gateway";

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
          state: newState
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
  })
};
