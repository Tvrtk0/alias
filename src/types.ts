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

export interface GameState {
  phase: GamePhase
  teams: Team[]
  activeTeamIndex: number
  settings: GameSettings
  currentRoundCorrect: number
  currentRoundSkipped: number
  usedWordIndices: number[]
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
  | { type: 'NEXT_TURN' }
  | { type: 'RESET' }
