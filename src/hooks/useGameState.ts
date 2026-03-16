import { useReducer } from 'react'
import type { GameState, GameAction } from '../types'
import { fisherYatesShuffle, getNextWord } from '../lib/wordPicker'
import words from '../data/words.json'

const initialState: GameState = {
  phase: 'setup',
  teams: [],
  activeTeamIndex: 0,
  settings: { roundTime: 60, targetScore: 50, skipPenalty: -1 },
  currentRoundCorrect: 0,
  currentRoundSkipped: 0,
  usedWordIndices: [],
  currentWordIndex: 0,
  shuffledIndices: [],
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const shuffled = fisherYatesShuffle(words.length)
      return {
        ...initialState,
        phase: 'turn-transition',
        teams: action.teams,
        settings: action.settings,
        shuffledIndices: shuffled,
        currentWordIndex: 0,
      }
    }

    case 'START_TURN': {
      const { wordIndex, newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        phase: 'playing',
        currentRoundCorrect: 0,
        currentRoundSkipped: 0,
        usedWordIndices: [wordIndex],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'CORRECT': {
      const { wordIndex, newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        currentRoundCorrect: state.currentRoundCorrect + 1,
        usedWordIndices: [...state.usedWordIndices, wordIndex],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'SKIP': {
      const { wordIndex, newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        currentRoundSkipped: state.currentRoundSkipped + 1,
        usedWordIndices: [...state.usedWordIndices, wordIndex],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'END_TURN': {
      const roundScore =
        state.currentRoundCorrect + state.currentRoundSkipped * state.settings.skipPenalty
      const updatedTeams = state.teams.map((team, i) =>
        i === state.activeTeamIndex ? { ...team, score: team.score + roundScore } : team,
      )
      const winner = updatedTeams.some((t) => t.score >= state.settings.targetScore)
      return {
        ...state,
        phase: winner ? 'game-over' : 'turn-summary',
        teams: updatedTeams,
      }
    }

    case 'NEXT_TURN': {
      const nextIndex = (state.activeTeamIndex + 1) % state.teams.length
      return {
        ...state,
        phase: 'turn-transition',
        activeTeamIndex: nextIndex,
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

export function useGameState() {
  return useReducer(gameReducer, initialState)
}
