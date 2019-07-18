import { createSelector } from "reselect";

const roomsSelector = state => state.rooms;
const lightsSelector = state => state.lights;
const appSelector = state => state.app;

export const isAnyLightOnInSelectedRoom = createSelector(
  [roomsSelector, lightsSelector, appSelector],
  (rooms, lights, app) => {
    const { selectedRoomId } = app;
    if (!rooms || !rooms[selectedRoomId]) {
      return false;
    }

    return rooms[selectedRoomId].lights
      .map(id => lights[id].state.on)
      .reduce((prev, current) => prev || current, false);
  }
);
