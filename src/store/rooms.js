import Gateway from "./../gateway";

export default {
  state: [],
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
