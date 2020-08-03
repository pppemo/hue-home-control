import Cookies from "js-cookie";
import { COOKIES } from "./../constants";

const getValueOrDefault = (cookieName, defaultValue) => {
  const cookieValue = Cookies.get(cookieName);
  switch (cookieValue) {
    case undefined:
    case null:
    case "":
      return defaultValue;
    case "true":
      return true;
    case "false":
      return false;
    default:
      return cookieValue;
  }
};

export default {
  state: {
    selectedRoomsIds: Cookies.get(COOKIES.SELECTED_ROOMS_IDS)?.split(","),
    defaultSceneId: Cookies.get(COOKIES.DEFAULT_SCENE_ID),
    isScreenSaverOn: false,
    selectedRoomSceneId: null,
    config: {
      actionTriggerSensorName: getValueOrDefault(
        COOKIES.CONFIG_ACTION_TRIGGER_SENSOR_NAME,
        null
      ),
      isSoundOn: getValueOrDefault(COOKIES.CONFIG_SOUNDS_ON, false),
      isScreensaverOn: getValueOrDefault(COOKIES.CONFIG_SCREENSAVER_ON, true),
      defaultReturnToPage: getValueOrDefault(
        COOKIES.CONFIG_DEFAULT_PAGE_TYPE,
        "scenes"
      ),
    },
  },
  reducers: {
    setIsScreenSaverOn: (state, isScreenSaverOn) => ({
      ...state,
      isScreenSaverOn,
    }),
    setSelectedRoomsIds: (state, selectedRoomsIds) => ({
      ...state,
      selectedRoomsIds,
    }),
    setSelectedRoomSceneId: (state, selectedRoomSceneId) => ({
      ...state,
      selectedRoomSceneId,
    }),
    setDefaultSceneId: (state, defaultSceneId) => ({
      ...state,
      defaultSceneId,
    }),
    resetSelectedRoomSceneId: (state) => ({
      ...state,
      selectedRoomSceneId: null,
    }),
    setConfigParam: (state, { name, value }) => ({
      ...state,
      config: {
        ...state.config,
        [name]: value,
      },
    }),
  },
};
