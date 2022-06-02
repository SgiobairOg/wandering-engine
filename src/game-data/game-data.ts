import { DEFAULT_GAME_DATA } from "./game-data.defaults";
import { join } from "path";
import { readFileSync } from "fs";

interface GameDataImport {
  title?: string;
  dialog?: {
    intro?: string;
    prompt?: string[];
  }
}

interface GameData {
  title: string;
  dialog: {
    intro: string;
    prompt: string[];
  },
  debug?: boolean;
}

function createGameData(): GameData {
  function load(): GameData {
    try {
      const gameDataFile = readFileSync(join(__dirname, './game-data.json'), 'utf8');

      if ( gameDataFile ) {
        console.log('Loading game data...\n\n');
        const gameData = JSON.parse(gameDataFile) as GameDataImport;
        console.log('Game data loaded successfully!\n\n');
        return {
          ...DEFAULT_GAME_DATA,
          ...gameData,
          dialog: {
            ...DEFAULT_GAME_DATA.dialog,
            ...gameData.dialog
          }
        }
      }
    } catch (err) {
      console.error('Game data load failed! Using defaults.', err);
    }

    return DEFAULT_GAME_DATA;
  }
  return Object.freeze(load());
}

export const gameData = createGameData();

export default gameData;
