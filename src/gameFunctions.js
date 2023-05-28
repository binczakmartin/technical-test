export const getArgs = (args) => {
  if (!args.game) return null;

  const [trump, state, players] = args.game.split("#");
  const playerNames = players.split(",");
  const cards = state.split("-");

  return { playerNames, cards, trump }
}

export const getTricksPoint = (cards, trump) => {
  const trickPoints = [];

  for (let i = 0; i < cards.length; i += 4) {
    const trick = cards.slice(i, i + 4);

    if (trick.length === 4) {
      trick.sort(compareCards);
      trickPoints.push(calculatePoints(trick, trump));
    }
  }

  return trickPoints;
}

export const calculatePoints = (trick, trump) => {
  let points = 0;

  for (const card of trick) {
    const value = card[0];
    if (value === "A") {
      points += 13;
    } else if (value === trump) {
      points += 2 * (14 - "23456789TJQKA".indexOf(value));
    } else {
      points += 14 - "23456789TJQKA".indexOf(value);
    }
  }

  return points;
}

export const compareCards = (card1, card2) => {
  const valuesOrder = "23456789TJQKA";
  const suitOrder = "SHDC";

  const [value1, suit1] = card1.split("");
  const [value2, suit2] = card2.split("");

  if (suit1 === suit2) {
    return valuesOrder.indexOf(value1) - valuesOrder.indexOf(value2);
  }

  return suitOrder.indexOf(suit1) - suitOrder.indexOf(suit2);
}

export const calculateTeamPoints = (trickPoints) => {
  let northSouth = 0;
  let eastWest = 0;

  for (let i = 0; i < trickPoints.length; i++) {
    if (i % 2 === 0) {
      northSouth += trickPoints[i];
    } else {
      eastWest += trickPoints[i];
    }
  }

  return { northSouth, eastWest };
}

export const getResult = (playerNames, trickPoints) => {
  const points = calculateTeamPoints(trickPoints);
  const team1 = trickPoints[0] > trickPoints[1] ? [0, 2] : [1, 3];
  const team2 = team1[0] === 0 ? [1, 3] : [0, 2];

  let result = `${points.northSouth}-${points.eastWest}#`;

  team1.forEach((index, i) => {
    result += playerNames[index];
    if (i < team1.length - 1) result += ',';
  });

  result += "#";

  team2.forEach((index, i) => {
    result += playerNames[index];
    if (i < team2.length - 1) result += ',';
  });

  return result;
}