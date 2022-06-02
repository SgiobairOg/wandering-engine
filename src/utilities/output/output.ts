import colors from 'colors';
import { gameData } from './../../game-data'
import { wrap } from "cli-format"

type OutputType = "normal" | "prompt" | "info" | "error" | "creepy";

export function output(text: string, type: OutputType = "normal"): void {
  const LINE_BREAK = '\n\n';
  const typeMap = {
    normal: colors.green(text),
    prompt: colors.blue(text),
    info: colors.white(text),
    error: colors.red(text),
    creepy: colors.trap(text),
  }

  if(!(type === 'error' && !gameData.debug)) {
    console.log(
      wrap(
        `${typeMap[type]}${LINE_BREAK}`,
        { width: 60 }
      )
    )
  }
}

export default output;