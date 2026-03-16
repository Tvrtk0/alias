import { useReducer } from 'react'
import type { GameState, GameAction } from '../types'
import { fisherYatesShuffle, getNextWord } from '../lib/wordPicker'
import words from '../data/words.json'

const initialState: GameState = {
  phase: 'setup',
  teams: [],
  activeTeamIndex: 0,
  settings: { roundTime: 60, targetScore: 50, skipPenalty: -1 },
  wordResults: [],
  currentWordIndex: 0,
  shuffledIndices: [],
  activePlayerIndices: [],
}

function calcRoundScore(state: GameState) {
  const correct = state.wordResults.filter((w) => w.correct).length
  const skipped = state.wordResults.filter((w) => !w.correct).length
  return correct + skipped * state.settings.skipPenalty
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
        activePlayerIndices: action.teams.map(() => 0),
      }
    }

    case 'START_TURN': {
      const { newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        phase: 'playing',
        wordResults: [],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'CORRECT': {
      // Record current word as correct, draw next word
      const currentWord = state.shuffledIndices[state.currentWordIndex - 1]
      const { wordIndex: _next, newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        wordResults: [...state.wordResults, { wordIndex: currentWord, correct: true }],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'SKIP': {
      const currentWord = state.shuffledIndices[state.currentWordIndex - 1]
      const { wordIndex: _next, newShuffled, newCurrentIndex } = getNextWord(
        state.shuffledIndices,
        state.currentWordIndex,
        words.length,
      )
      return {
        ...state,
        wordResults: [...state.wordResults, { wordIndex: currentWord, correct: false }],
        currentWordIndex: newCurrentIndex,
        shuffledIndices: newShuffled ?? state.shuffledIndices,
      }
    }

    case 'END_TURN': {
      return {
        ...state,
        phase: 'turn-summary',
      }
    }

    case 'TOGGLE_WORD': {
      const wordResults = state.wordResults.map((w, i) =>
        i === action.index ? { ...w, correct: !w.correct } : w,
      )
      return { ...state, wordResults }
    }

    case 'NEXT_TURN': {
      // Apply score now (after possible corrections)
      const roundScore = calcRoundScore(state)
      const updatedTeams = state.teams.map((team, i) =>
        i === state.activeTeamIndex ? { ...team, score: team.score + roundScore } : team,
      )
      const winner = updatedTeams.some((t) => t.score >= state.settings.targetScore)

      if (winner) {
        return {
          ...state,
          phase: 'game-over',
          teams: updatedTeams,
        }
      }

      const activeTeam = state.teams[state.activeTeamIndex]
      const newPlayerIndices = [...state.activePlayerIndices]
      if (activeTeam.players.length > 0) {
        newPlayerIndices[state.activeTeamIndex] =
          (newPlayerIndices[state.activeTeamIndex] + 1) % activeTeam.players.length
      }

      const nextIndex = (state.activeTeamIndex + 1) % state.teams.length
      return {
        ...state,
        phase: 'turn-transition',
        teams: updatedTeams,
        activeTeamIndex: nextIndex,
        activePlayerIndices: newPlayerIndices,
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
