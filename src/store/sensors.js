import Gateway from "../gateway";
import store from "./../store";

const getSensorIdByItsName = (sensors, name) => {
  if (sensors) {
    const sensor = Object.entries(sensors).find(
      ([_, value]) => value.name === name
    );
    return sensor ? sensor[0] : null;
  }
  return null;
};

export default {
  state: null,
  reducers: {
    setSensors: (_, payload) => payload,
  },
  effects: (dispatch) => ({
    async getSensors() {
      const sensors = await Gateway.getSensors();
      dispatch.sensors.setSensors(sensors);
    },
    async handleLightActionTriggered() {
      const {
        app: {
          config: { actionTriggerSensorName },
        },
        sensors,
      } = store.getState();

      if (actionTriggerSensorName) {
        const sensorId = getSensorIdByItsName(sensors, actionTriggerSensorName);

        if (sensorId) {
          await Gateway.setSensorState(sensorId, { flag: true });
        }
      }
    },
  }),
};
