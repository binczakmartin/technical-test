import { CARDS } from "./constants.js";

// Calculate the points for a card double the points if it's a trump */
export const calculatePoints = (card, trump) => {
  const points = CARDS[card[0]];

  return card[1] === trump ? points * 2 : points;
};

// Determine the winner of a trick.
// Cards that are not of the same suit or not a trump do not earn points
export const determineWinner = (trick, trump) => {
  const suit = trick[0][1];
  console.log(`trump = ${trump} suit = ${suit} trick = ${trick}`);
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
};

// Calculate points for each players considering that we play clockwise
export const calculateGameResult = (gameString) => {
  const [ trump, state, players ] = gameString.split('#');
  const playerNames = players.split(',');
  const cards = state.split('-');
  const playerPoints = [0, 0, 0, 0];

  // The game starts by the north player
  let lastWinnerIndex = 0;
  let winnerIndex = 0;
  let trickNumber = 1;

  for (let i = 0; i < cards.length; i++) {
    if ((i + 1) % 4 === 0) {
      console.log(`\n${playerNames[lastWinnerIndex]} start the trick`);

      const winner = determineWinner([cards[i - 3], cards[i - 2], cards[i - 1], cards[i]], trump);
      const points = calculatePoints(winner, trump);
      const limit = 4 * trickNumber;
      // retrieve the winner considering starting player can change every trick
      // the winner of the last trick start the new trick
      winnerIndex = cards.indexOf(winner);

      if ((winnerIndex % 4 + lastWinnerIndex) % 4 === 0) {
        lastWinnerIndex = 0;
      } else if (winnerIndex + lastWinnerIndex > limit) {
        lastWinnerIndex = winnerIndex + lastWinnerIndex - limit;
      } else {
        lastWinnerIndex = winnerIndex % 4 + lastWinnerIndex;
      }

      playerPoints[lastWinnerIndex] += points;

      console.log(`player ${playerNames[lastWinnerIndex]} of ${
        lastWinnerIndex === 0 || lastWinnerIndex === 2 ? 'North team' : 'East team'
      } scored ${points}`);

      trickNumber++;
    }
  }

  return playerPoints;
};

/* format the result string */
export const getGameResult = (gameString) => {
  const players = gameString.split('#')[2];
  const playerNames = players.split(',');
  const playerPoints = calculateGameResult(gameString);
  const northTeamWin = playerPoints[0] + playerPoints[2] > playerPoints[1] + playerPoints[3];

  // order player by score
  const team1 =
    playerPoints[0] > playerPoints[2] ? `${playerNames[0]},${playerNames[2]}` : `${playerNames[2]},${playerNames[0]}`;
  const team2 =
    playerPoints[1] > playerPoints[3] ? `${playerNames[1]},${playerNames[3]}` : `${playerNames[3]},${playerNames[1]}`;

  // biggest score first
  const gameScore = `${playerPoints[0] + playerPoints[2]}-${playerPoints[1] + playerPoints[3]}`;
  const winningTeam = northTeamWin ? team1 : team2;
  const losingTeam = northTeamWin ? team2 : team1;

  return `${gameScore}#${winningTeam}#${losingTeam}`;
};
