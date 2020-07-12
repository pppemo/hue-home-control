import { createSelector } from "reselect";

const roomsSelector = (state) => state.rooms;
const lightsSelector = (state) => state.lights;
const appSelector = (state) => state.app;

export const isAnyLightOnInSelectedRooms = createSelector(
  [roomsSelector, lightsSelector, appSelector],
  (rooms, lights, app) => {
    const { selectedRoomsIds } = app;
    if (selectedRoomsIds && rooms && lights) {
      return selectedRoomsIds
        .reduce((acc, roomId) => [...acc, ...rooms[roomId].lights], [])
        .map((id) => lights[id].state.on)
        .reduce((prev, current) => prev || current, false);
    }
    return false;
  }
);
