import { init } from "@rematch/core";
import createLoadingPlugin from '@rematch/loading';
import rooms from "./rooms";
import lights from "./lights";

const loadingPlugin = createLoadingPlugin({})

const store = init({
  plugins: [loadingPlugin],
  models: {
    rooms,
    lights
  }
});

export default store;
export const { dispatch } = store;
