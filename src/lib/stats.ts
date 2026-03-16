import type { GameStats } from '../types'

const STORAGE_KEY = 'alias-stats'

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: {},
  bestRound: null,
  recentGames: [],
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultStats }
    return JSON.parse(raw) as GameStats
  } catch {
    return { ...defaultStats }
  }
}

export function saveGameResult(
  teams: Array<{ name: string; score: number }>,
  winner: string,
) {
  const stats = loadStats()
  stats.gamesPlayed++
  stats.wins[winner] = (stats.wins[winner] ?? 0) + 1

  stats.recentGames.unshift({
    date: new Date().toISOString(),
    teams: teams.map((t) => t.name),
    scores: teams.map((t) => t.score),
    winner,
  })
  // Keep only last 20 games
  if (stats.recentGames.length > 20) stats.recentGames.length = 20

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function clearStats() {
  localStorage.removeItem(STORAGE_KEY)
}
