import { gameAbstractions } from "/resources/gameAbstractions.js";

// Get the abstraction for a game, or null if none exists
export function getAbstractionForGame(gameId) {
  for (const [key, abstraction] of Object.entries(gameAbstractions)) {
    if (abstraction.gameIds.includes(gameId)) {
      return { key, ...abstraction };
    }
  }
  return null;
}

export function getGameIdsInAbstraction(abstractionKey) {
  return gameAbstractions[abstractionKey]?.gameIds || [];
}

export function getDisplayGameForAbstraction(games, abstractionKey) {
  const abstraction = gameAbstractions[abstractionKey];
  if (!abstraction) return null;
  return games.find(g => g.id === abstraction.displayId) || null;
}

export function isGameInAbstraction(gameId) {
  return getAbstractionForGame(gameId) !== null;
}

export function getAllAbstractedGameIds() {
  const allIds = new Set();
  Object.values(gameAbstractions).forEach(abstraction => {
    abstraction.gameIds.forEach(id => allIds.add(id));
  });
  return Array.from(allIds);
}

