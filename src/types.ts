export type GamePhase = 'setup' | 'turn-transition' | 'playing' | 'turn-summary' | 'game-over'

export interface Team {
  name: string
  players: string[]
  score: number
}

export interface GameSettings {
  roundTime: number
  targetScore: number
  skipPenalty: number
}

export interface WordResult {
  wordIndex: number
  correct: boolean
}

export interface GameState {
  phase: GamePhase
  teams: Team[]
  activeTeamIndex: number
  settings: GameSettings
  wordResults: WordResult[]
  currentWordIndex: number
  shuffledIndices: number[]
  activePlayerIndices: number[]
}

export type GameAction =
  | { type: 'START_GAME'; teams: Team[]; settings: GameSettings }
  | { type: 'START_TURN' }
  | { type: 'CORRECT' }
  | { type: 'SKIP' }
  | { type: 'END_TURN' }
  | { type: 'TOGGLE_WORD'; index: number }
  | { type: 'NEXT_TURN' }
  | { type: 'RESET' }

export interface GameStats {
  gamesPlayed: number
  wins: Record<string, number>
  bestRound: { team: string; score: number; date: string } | null
  recentGames: Array<{ date: string; teams: string[]; scores: number[]; winner: string }>
}
