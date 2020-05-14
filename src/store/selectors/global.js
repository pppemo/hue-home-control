import { createSelector } from "reselect";

const roomsSelector = (state) => state.rooms;
const lightsSelector = (state) => state.lights;
const scenesSelector = (state) => state.scenes;
const sensorsSelector = (state) => state.sensors;

export const isDataLoaded = createSelector(
  [roomsSelector, lightsSelector, scenesSelector, sensorsSelector],
  (rooms, lights, scenes, sensors) => rooms && lights && scenes && sensors
);
