import { CARDS } from "./constants.js";

// Calculate the points for a card double the points if it's the trump */
export const calculatePoints = (card, trump) => {
  const points = CARDS[card[0]];

  return card[1] === trump ? points * 2 : points;
}

// Determine the winner of a trick.
// Cards that are not of the same suit or not a trump do not earn points
export const determineWinner = (trick, trump) => {
  const suit = trick[0][1];
  console.log(`trump = ${trump} suit = ${suit} tick = ${trick}`);
  trick.shift(); // the first played card of each trick don't give points
  const trumpCards = trick.filter(card => card[1] === trump);
  const suitCards = trick.filter(card => card[1] === suit);

  if (trumpCards.length > 0) {
    const maxTrumpCard = trumpCards.reduce((maxCard, card) => {
      return calculatePoints(card, trump) > calculatePoints(maxCard, trump) ? card : maxCard;
    });
    console.log("winner card with trump ", maxTrumpCard);
    return maxTrumpCard;
  }

  const maxSuitCard = suitCards.reduce((maxCard, card) => {
    return calculatePoints(card, trump) > calculatePoints(maxCard, trump) ? card : maxCard;
  });

  console.log("winner card with suit ", maxSuitCard);
  return maxSuitCard;
}

// Calculate points for each teams considering that we play clockwise
export const calculateGameResult = (game) => {
  const [trump, state, players] = game.split('#');
  const cards = state.split('-');
  const playerNames = players.split(',');

  let northPoints = 0;
  let southPoints = 0;
  let northTeamStarting = true; // The game starts by the north player

  for (let i = 0; i < cards.length; i++) {
    if ((i + 1) % 4 === 0) {
      const winner = determineWinner([cards[i - 3], cards[i - 2], cards[i - 1], cards[i]], trump);

      if (cards.includes(winner)) {
        const points = calculatePoints(winner, trump);
        const winnerIndex = cards.indexOf(winner);
        // Other game starts by the players who has scored the most points in the previous game.
        const isNorthTeam = northTeamStarting
          ? (winnerIndex === 0 || winnerIndex === 2)
          : !(winnerIndex === 0 || winnerIndex === 2);

        if (isNorthTeam) {
          northPoints += points;
        } else {
          southPoints += points;
        }
        console.log(`${isNorthTeam ? 'North team' : 'East team'} scored ${points}`);
      }
      // Change order if other team win
      northTeamStarting = ((cards.indexOf(winner) === 0 || cards.indexOf(winner) === 2) && northTeamStarting)
        || ((cards.indexOf(winner) === 1 || cards.indexOf(winner) === 3) && !northTeamStarting);
    }
  }

  return `${northPoints}-${southPoints}#${playerNames[0]},${playerNames[2]}#${playerNames[3]},${playerNames[1]}`;
}