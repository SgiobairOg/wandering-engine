import { join } from 'path';
import { readFile } from 'fs/promises';

export interface RoomAction {
  action: string;
  input?: string | RoomCoordinates;
}

export interface RoomInventoryItem {
  id: number;
  name: string;
  description: string;
  transferable?: boolean;
  infinite?: boolean;
  usese?: number;
}

export interface RoomCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface RoomData {
  id: string;
  coordinates: RoomCoordinates;
  description?: string;
  north?: RoomAction;
  south?: RoomAction;
  east?: RoomAction;
  west?: RoomAction;
  up?: RoomAction;
  down?: RoomAction;
  inventory?: RoomInventoryItem[];
}

export interface RoomsData {
  [key: string]: RoomData;
}

export function createRoomData() {
  let rooms:RoomsData = {};
  let currentRoom: RoomData | null;

  function getRoomId(room: RoomCoordinates) {
    return `${room.x}-${room.y}-${room.z}`;
  }

  async function getRoom(room: RoomCoordinates): Promise<RoomData | null> {
    const roomId = getRoomId(room);

    if (!rooms[roomId]) {
      // attempt to load room data from rooms
      try {
        const roomDataFile = await readFile(join(__dirname, `./rooms/${roomId}.json`), 'utf8');

        if (roomDataFile) {
          const roomData = {
            id: roomId,
            coordinates: room,
            ...JSON.parse(roomDataFile)} as RoomData;
          rooms[roomId] = roomData;
          return roomData;
        }
      } catch (err) {
        return null
      }
    } else {
      return rooms[roomId];
    }

    return null;  
  }

  async function cacheAdjacentRooms(room: RoomCoordinates) {
    const adjacentRooms = [
      { x: room.x - 1, y: room.y, z: room.z },
      { x: room.x + 1, y: room.y, z: room.z },
      { x: room.x, y: room.y - 1, z: room.z },
      { x: room.x, y: room.y + 1, z: room.z },
      { x: room.x, y: room.y, z: room.z - 1 },
      { x: room.x, y: room.y, z: room.z + 1 },
    ];

    const adjacentRoomsIds = adjacentRooms.map(getRoomId);

    for (const adjacentRoom of adjacentRooms) {
      await getRoom(adjacentRoom);
    }
    
    // clean up non-adjacent rooms
    for (const roomId in rooms) {
      if (!adjacentRoomsIds.includes(roomId)) {
        delete rooms[roomId];
      }
    }
  }

  async function loadRoom(room: RoomCoordinates): Promise<RoomData | null> {
    const roomId = getRoomId(room);

    if (!rooms[roomId]) {
      // attempt to load room data from rooms
      currentRoom = await getRoom(room)
    } else {
      currentRoom = rooms[roomId];
    }

    cacheAdjacentRooms(room);

    return currentRoom;  
  }


  function getCurrentRoom():RoomData | null {
    return currentRoom;
  }

  return {
    loadRoom,
    getCurrentRoom,
  }
}

export const roomData = createRoomData();

export default roomData