import { getGameResult } from "./src/game.js";
import { checkErrors } from "./src/errors.js";

export const handler = (event, context, callback) => {
  try {
    const gameString = event.body.game || JSON.parse(event.body).game;
    const error = checkErrors(gameString);

    if (error) {
      console.log(error);
      callback({ error }, 400);
    }

    console.log("gameString =>", gameString);
    const result = getGameResult(gameString);
  
    callback({ result }, 200);
  } catch (error) {
    console.log('error', error)
    callback({ error: error.message }, 500);
  }
};
