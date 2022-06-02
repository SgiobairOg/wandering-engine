import { MoveDirection, actions } from './../actions';

import { gameData } from './../game-data';
import { output } from './../utilities/output';
import prompts from 'prompts';

type Command = {
  command: string,
  label: string,
}

type CommandKeys = {
  [key: string]: Command
}

function createPrompt() {
  const keys: CommandKeys = {
    w: {
      command: 'north',
      label: 'Move North',
    },
    s: {
      command: 'south',
      label: 'Move South',
    },
    a: {
      command: 'west',
      label: 'Move West', 
    },
    d: {
      command: 'east',
      label: 'Move East',
    },
    e: {
      command: 'up',
      label: 'Move Up',
    },
    q: {
      command: 'down',
      label: 'Move Down',
    },
  }

  async function get(): Promise<any> {
    const promptInstructions = Object.entries(keys).map(([key, value]) => {
      return `${key} - ${value.label}`;
    }).join('  |  ');

    output(promptInstructions, 'prompt');

    const response = await prompts({
      type: 'text',
      name: 'input',
      message: gameData.dialog.prompt[Math.floor(Math.random()*gameData.dialog.prompt.length)]
    })

    output('\n')

    if(Object.keys(keys).includes(response.input)) {
      const action: Command = keys[response.input as keyof CommandKeys];
      await actions.useAction(action.command as MoveDirection);

      return get()
    };

    output('Nope, try again', 'info');

    return get()
  }

  return {get}
}

export const prompt = createPrompt();

export default prompt;