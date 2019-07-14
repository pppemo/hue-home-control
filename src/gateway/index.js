import axios from "axios";

const {
  REACT_APP_HUE_BRIDGE_ENDPOINT,
  REACT_APP_HUE_BRIDGE_USERNAME
} = process.env;

const hueClient = axios.create({
  baseURL: `${REACT_APP_HUE_BRIDGE_ENDPOINT}/api/${REACT_APP_HUE_BRIDGE_USERNAME}`,
  timeout: 30000
});

const errorHandler = response => {
  //TODO Implement error handling
}

hueClient.interceptors.response.use(
  response => response.data,
  errorHandler
)

export default {
  getLightsInfo: () => hueClient.get("/lights"),
  getRooms: () => hueClient.get("/groups"),
  getScenes: () => hueClient.get("/scenes")
};
