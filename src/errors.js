import { ERRORS, TRUMPS, CARDS } from "./constants.js";

/* Error management */
export const checkErrors = (gameString) => {
  const [trump, state, players] = gameString.split('#');
  const playerNames = players.split(',');
  const cards = state.split('-');

  if (!trump || !state || !players) {
    return ERRORS.MISSING_PART;
  }

  if (cards.length % 4) {
    return ERRORS.INVALID_CARD_NUMBER
  }

  if (playerNames.length !== 4) {
    return ERRORS.INVALID_PLAYER_NUMBER
  }

  if (TRUMPS.indexOf(trump) === -1) {
    return ERRORS.INVALID_TRUMP
  }

  for (let card of cards) {
    if (card.length != 2 || TRUMPS.indexOf(card[1]) === -1 || !CARDS[card[0]]) {
      return ERRORS.INVALID_CARD;
    }
  }

  return 0;
}