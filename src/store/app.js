export default {
  state: {
    selectedRoomId: null,
    isScreenSaverOn: false
  },
  reducers: {
    setIsScreenSaverOn: (state, isScreenSaverOn) => ({
      ...state,
      isScreenSaverOn
    }),
    setSelectedRoomId: (state, selectedRoomId) => ({
      ...state,
      selectedRoomId
    })
  }
};
