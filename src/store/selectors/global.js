import { createSelector } from "reselect";

const roomsSelector = state => state.rooms
const lightsSelector = state => state.lights
const scenesSelector = state => state.scenes

export const isDataLoaded = createSelector(
  [roomsSelector, lightsSelector, scenesSelector],
  (rooms, lights, scenes) => rooms && lights && scenes
)
