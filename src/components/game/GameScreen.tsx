import { useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext'
import { useTimer } from '../../hooks/useTimer'
import { playSound } from '../../lib/sounds'
import words from '../../data/words.json'
import Timer from './Timer'
import WordCard from './WordCard'
import ActionButtons from './ActionButtons'

export default function GameScreen() {
  const { state, dispatch } = useGame()
  const hasEnded = useRef(false)

  const { secondsLeft, isRunning, start } = useTimer(
    state.settings.roundTime,
    (s) => {
      if (s <= 10) playSound('tick')
    },
    () => {
      if (!hasEnded.current) {
        hasEnded.current = true
        playSound('time-up')
        dispatch({ type: 'END_TURN' })
      }
    },
  )

  useEffect(() => {
    hasEnded.current = false
    start()
  }, [start])

  // currentWordIndex points to the NEXT word to draw; the word being shown is at index - 1
  const currentWord =
    state.currentWordIndex > 0
      ? words[state.shuffledIndices[state.currentWordIndex - 1]]
      : ''

  const handleCorrect = () => {
    if (!isRunning) return
    playSound('correct')
    dispatch({ type: 'CORRECT' })
  }

  const handleSkip = () => {
    if (!isRunning) return
    playSound('skip')
    dispatch({ type: 'SKIP' })
  }

  const activeTeam = state.teams[state.activeTeamIndex]
  const activePlayer = activeTeam.players.length > 0
    ? activeTeam.players[state.activePlayerIndices[state.activeTeamIndex]] ?? activeTeam.players[0]
    : null

  return (
    <div className="min-h-dvh flex flex-col px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-primary font-semibold">{activeTeam.name}</span>
          {activePlayer && (
            <span className="text-gray-400 text-sm ml-2">({activePlayer})</span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          ✓ {state.wordResults.filter((w) => w.correct).length} &nbsp; ✗ {state.wordResults.filter((w) => !w.correct).length}
        </span>
      </div>

      {/* Timer */}
      <Timer secondsLeft={secondsLeft} total={state.settings.roundTime} />

      {/* Word */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-sm">
          <WordCard word={currentWord} />
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-sm w-full mx-auto">
        <ActionButtons
          onCorrect={handleCorrect}
          onSkip={handleSkip}
          disabled={!isRunning}
        />
      </div>
    </div>
  )
}
