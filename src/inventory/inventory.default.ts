/**
 * Default items to be added to the inventory on startup
 * Will be ovveridden by the config stored inventory if player isn't new
 */
export const DEFAULT_INVENTORY = [
  {
    "id": 0,
    "name": "a strange note",
    "description": "It's a note written in a language unknown to you.\nYour best guess to its meaning is \"Cats fear pickles\" but\nthat's nonsense. Why would you even think that?",
    "infinite": true
  }
]

/**
 * Helper function to ensure defaults are not duplicated
 * May need to update this method if the default inventory changes to include consumable items
 */
export const defaultIds = new Set(DEFAULT_INVENTORY.map(item => item.id));
