import { getArgs, getTricksPoint, getResult } from "./src/gameFunctions.js";

export const handler = (event, context, callback) => {
  try {
    const { playerNames, cards, trump } = getArgs(JSON.parse(event.body));
    const trickPoints = getTricksPoint(cards, trump);
    const result = getResult(playerNames, trickPoints);
  
    callback({ result }, 200);
  } catch (e) {
    throw e;
  }
};
