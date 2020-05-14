import { init } from "@rematch/core";
import createLoadingPlugin from "@rematch/loading";
import rooms from "./rooms";
import lights from "./lights";
import scenes from "./scenes";
import sensors from "./sensors";
import app from "./app";

const loadingPlugin = createLoadingPlugin({});

const store = init({
  plugins: [loadingPlugin],
  models: {
    rooms,
    lights,
    scenes,
    sensors,
    app,
  },
});

export default store;
export const { dispatch } = store;
