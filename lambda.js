import { getGameResult } from "./src/game.js";
import { checkErrors } from "./src/errors.js";

export const handler = (event, context, callback) => {
  try {
    const gameString = event.body.game || JSON.parse(event.body).game;
    const error = checkErrors(gameString);

    if (error) {
      callback(undefined, {
        statusCode: 400,
        body: JSON.stringify({
            message: error
        })
      });
    }

    const result = getGameResult(gameString);
  
    callback(undefined, {
      statusCode: 200,
      body: JSON.stringify({
        message: result
      })
    });
  } catch (error) {
    callback(Error(error));
  }
};
