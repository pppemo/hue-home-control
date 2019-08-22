import { createSelector } from "reselect";

const scenesSelector = state => state.scenes;

export const hasScenes = createSelector(
  [scenesSelector],
  scenes => scenes && !!(Object.values(scenes).length > 0)
);
