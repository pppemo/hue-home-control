import Cookies from "js-cookie";
import { COOKIES, CONFIG_KEYS } from "./../constants";

const getConfigValueOrDefault = (configKey, defaultValue) => {
  const cookieValue = Cookies.get(`CONFIG_${configKey}`);
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
      [CONFIG_KEYS.ACTION_TRIGGER_SENSOR_NAME]: getConfigValueOrDefault(
        CONFIG_KEYS.ACTION_TRIGGER_SENSOR_NAME,
        null
      ),
      [CONFIG_KEYS.SOUNDS_ON]: getConfigValueOrDefault(
        CONFIG_KEYS.SOUNDS_ON,
        false
      ),
      [CONFIG_KEYS.SCREENSAVER_ON]: getConfigValueOrDefault(
        CONFIG_KEYS.SCREENSAVER_ON,
        true
      ),
      [CONFIG_KEYS.SHOULD_SHOW_ROOM_LABEL_ON_SWITCH]: getConfigValueOrDefault(
        CONFIG_KEYS.SHOULD_SHOW_ROOM_LABEL_ON_SWITCH,
        true
      ),
      [CONFIG_KEYS.DEFAULT_PAGE_TYPE]: getConfigValueOrDefault(
        CONFIG_KEYS.DEFAULT_PAGE_TYPE,
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
