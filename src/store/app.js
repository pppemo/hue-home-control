export default {
  state: {
    selectedRoomId: null,
    isScreenSaverOn: false,
    selectedRoomSceneId: null
  },
  reducers: {
    setIsScreenSaverOn: (state, isScreenSaverOn) => ({
      ...state,
      isScreenSaverOn
    }),
    setSelectedRoomId: (state, selectedRoomId) => ({
      ...state,
      selectedRoomId
    }),
    setSelectedRoomSceneId: (state, selectedRoomSceneId) => ({
      ...state,
      selectedRoomSceneId
    }),
    resetSelectedRoomSceneId: (state) => ({
      ...state,
      selectedRoomSceneId: null
    })
  }
};
