import { createSelector } from "reselect";

const roomsSelector = state => state.rooms
const lightsSelector = state => state.lights

export const isDataLoaded = createSelector(
  [roomsSelector, lightsSelector],
  (rooms, lights) => rooms && lights
)
