import { init } from "@rematch/core";
import createLoadingPlugin from '@rematch/loading';
import rooms from "./rooms";

const loadingPlugin = createLoadingPlugin({})

const store = init({
  plugins: [loadingPlugin],
  models: {
    rooms
  }
});

export default store;
export const { dispatch } = store;
