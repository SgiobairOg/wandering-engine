#!/usr/bin/env node

"use strict";

import { actions } from "./actions"
import { gameData } from "./game-data"
import { output } from "./utilities/output"
import { prompt } from "./prompt"
import { saveData } from "./save-data"

if(saveData.get("newGame") === true) {
    saveData.set("inventory", []);
    saveData.set("newGame", false);
} else {
  output('No save data', 'error')
}

async function main() {
  output(`Welcome to ${gameData.title}!`, 'creepy');
  output(gameData.dialog.intro);

  await actions.move({ x: 0, y: 0, z: 1 });

  prompt.get();
}

main()