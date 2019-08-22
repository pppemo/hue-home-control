import Cookies from "js-cookie"
import { COOKIES } from "./../constants"

export default {
  state: {
    selectedRoomId: Cookies.get(COOKIES.SELECTED_ROOM_ID),
    defaultSceneId: Cookies.get(COOKIES.DEFAULT_SCENE_ID),
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
    setDefaultSceneId: (state, defaultSceneId) => ({
      ...state,
      defaultSceneId
    }),
    resetSelectedRoomSceneId: (state) => ({
      ...state,
      selectedRoomSceneId: null
    })
  }
};
