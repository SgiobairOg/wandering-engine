import { RoomAction, roomData } from "./../room-data";
import { RoomCoordinates, RoomData } from "./../room-data";

import output from "../utilities/output";

export type MoveDirection = "north" | "south" | "east" | "west" | "up" | "down" | "start";

export function getActions() {
  /**
   * Generate coordinates for the next room from the current room and direction
   * @param direction 
   * @returns 
   */
  function getNewRoomCoordinates(direction: MoveDirection = "north"): RoomCoordinates {
    const {x, y, z} = roomData.getCurrentRoom()?.coordinates || {x: 0, y: 0, z: 1};
    const transforms: { [key: string]: RoomCoordinates } = {
      north: { x: x + 1, y, z },
      south: { x: x - 1, y, z },
      east: { x, y: y + 1, z },
      west: { x, y: y - 1, z },
      up: { x, y, z: z + 1 },
      down: { x, y, z: z - 1 },
      start: { x: 0, y: 0, z: 1 },
    }

    return transforms[direction];
  }
  /**
   * move
   * @param room: RoomCoordinates
   * 
   * retrieves the room data for the room specified by room and triggers the room outputs 
   */
  async function move(room: RoomCoordinates): Promise<void> {
    return roomData.loadRoom(room).then((room: RoomData | null) => {
      if (room) {
        output(`${room.description}`);
      } else {
        output("You can't go there", "info");
      }
    });
  }

  async function createMove(newCoordinates: RoomCoordinates | null, direction: MoveDirection): Promise<void> {
    if(!newCoordinates) {
      output(`No coordinates provided for move to ${direction}`, "error");
      newCoordinates = getNewRoomCoordinates(direction);
      output(`Created new coordinates: ${JSON.stringify(newCoordinates)}`, "error");
    } else {
      output(`New coordinates provided by input: ${JSON.stringify(newCoordinates)}`, "error");
    }
    await move(newCoordinates);
  }

  function dialog(text: string) {
    output(text, "info");
  }

  function useAction(direction: MoveDirection): Promise<void> {
    output(`You chose ${direction}`);
    const actionData:(RoomAction | null) = roomData.getCurrentRoom()?.[direction as keyof RoomData] as RoomAction;
    const actionPaths: { [key: string]: Function } = {
      move: createMove,
      dialog: dialog,
    }

    return actionPaths[actionData?.action || "move"](actionData?.input || null, direction);
  }

  return {
    move,
    useAction,
  }
}

export const actions = getActions();

export default actions;