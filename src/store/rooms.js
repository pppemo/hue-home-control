import Gateway from "./../gateway";

export default {
  state: null,
  reducers: {
    setRooms: (_, payload) => payload
  },
  effects: dispatch => ({
    async getRooms() {
      const rooms = await Gateway.getRooms();
      dispatch.rooms.setRooms(rooms);
    }
  })
};
