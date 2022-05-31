import { DEFAULT_INVENTORY, defaultIds } from "./inventory.default";

import { saveData } from "./../save-data";

const inventory: Array<any> = [
    ...DEFAULT_INVENTORY,
    ...((saveData.get("inventory") || []) as Array<any>).filter(item => !defaultIds.has(item.id))
];

saveData.set("inventory", inventory);

export const checkInventory = () => {
  console.log('Checking inventory...');
  for ( const item of inventory ) {
    console.log(`${item.name}. ${item.description}`);
  }
}

export default checkInventory;