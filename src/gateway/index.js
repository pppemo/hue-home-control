import axios from "axios";
import Cookies from "js-cookie";
import { COOKIES } from "./../constants";

const HUE_BRIDGE_IP = Cookies.get(COOKIES.HUE_BRIDGE_IP);
const HUE_BRIDGE_USER = Cookies.get(COOKIES.HUE_BRIDGE_USER);

export const isBridgeDiscovered = () => {
  const HUE_BRIDGE_IP = Cookies.get(COOKIES.HUE_BRIDGE_IP);
  const HUE_BRIDGE_USER = Cookies.get(COOKIES.HUE_BRIDGE_USER);
  return !!HUE_BRIDGE_IP && !!HUE_BRIDGE_USER;
};

const hueClient = axios.create({
  baseURL: `https://discovery.meethue.com`,
  timeout: 60000,
});

const bridgeClient = axios.create({
  baseURL: `http://${HUE_BRIDGE_IP}/api/${HUE_BRIDGE_USER}`,
  timeout: 30000,
});

const errorHandler = (response) => {
  //TODO Implement error handling
};

bridgeClient.interceptors.response.use(
  //TODO Implement Hue error handling with 200 status
  (response) => response.data,
  errorHandler
);

export default {
  findBridgeIp: () => hueClient.get("/"),
  createNewUser: (bridgeIp, clientName) =>
    axios({
      url: "/api",
      baseURL: `http://${bridgeIp}`,
      method: "post",
      data: {
        devicetype: `hue-home-control#${clientName}`,
      },
    }),
  getLightsInfo: () => bridgeClient.get("/lights"),
  getRooms: () => bridgeClient.get("/groups"),
  getScenes: () => bridgeClient.get("/scenes"),
  getSensors: () => bridgeClient.get("/sensors"),
  setSensorState: (id, state) =>
    bridgeClient.put(`/sensors/${id}/state`, state),
  setLightState: (id, state) => bridgeClient.put(`/lights/${id}/state`, state),
  setGroupState: (id, state) => bridgeClient.put(`/groups/${id}/action`, state),
};
