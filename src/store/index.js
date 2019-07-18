import { init } from "@rematch/core";
import createLoadingPlugin from '@rematch/loading';
import rooms from "./rooms";
import lights from "./lights";
import app from "./app";

const loadingPlugin = createLoadingPlugin({})

const store = init({
  plugins: [loadingPlugin],
  models: {
    rooms,
    lights,
    app
  }
});

export default store;
export const { dispatch } = store;
