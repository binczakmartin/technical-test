import { calculateGameResult } from "./src/game.js";
export const handler = (event, context, callback) => {
  try {
    const payload = JSON.parse(event.body)

    console.log("game", payload.game);
    const result = calculateGameResult(payload.game);
  
    callback({ result }, 200);
  } catch (e) {
    throw e;
  }
};
