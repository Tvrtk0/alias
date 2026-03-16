import { useEffect, useRef, useState, useCallback } from 'react'
import { useGame } from '../../context/GameContext'
import { useTimer } from '../../hooks/useTimer'
import { playSound } from '../../lib/sounds'
import words from '../../data/words.json'
import Timer from './Timer'
import WordCard from './WordCard'
import ActionButtons from './ActionButtons'

type SwipeDirection = 'left' | 'right' | null

export default function GameScreen() {
  const { state, dispatch } = useGame()
  const hasEnded = useRef(false)
  const [countdown, setCountdown] = useState(3)
  const [swipeDir, setSwipeDir] = useState<SwipeDirection>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

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

  // Countdown before round
  useEffect(() => {
    hasEnded.current = false
    if (countdown <= 0) return

    playSound('countdown')
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1)
    }, 800)
    return () => clearTimeout(timer)
  }, [countdown])

  // Start game timer after countdown
  useEffect(() => {
    if (countdown === 0) {
      start()
    }
  }, [countdown, start])

  const currentWord =
    state.currentWordIndex > 0
      ? words[state.shuffledIndices[state.currentWordIndex - 1]]
      : ''

  const handleCorrect = useCallback(() => {
    if (!isRunning || countdown > 0) return
    playSound('correct')
    dispatch({ type: 'CORRECT' })
  }, [isRunning, countdown, dispatch])

  const handleSkip = useCallback(() => {
    if (!isRunning || countdown > 0) return
    playSound('skip')
    dispatch({ type: 'SKIP' })
  }, [isRunning, countdown, dispatch])

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = Math.abs(touch.clientY - touchStart.current.y)
    touchStart.current = null

    // Only trigger if horizontal swipe is dominant and > 80px
    if (Math.abs(deltaX) > 80 && deltaY < Math.abs(deltaX)) {
      if (deltaX > 0) {
        setSwipeDir('right')
        setTimeout(() => { handleCorrect(); setSwipeDir(null) }, 200)
      } else {
        setSwipeDir('left')
        setTimeout(() => { handleSkip(); setSwipeDir(null) }, 200)
      }
    }
  }

  const activeTeam = state.teams[state.activeTeamIndex]
  const activePlayer = activeTeam.players.length > 0
    ? activeTeam.players[state.activePlayerIndices[state.activeTeamIndex]] ?? activeTeam.players[0]
    : null

  // Countdown overlay
  if (countdown > 0) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <span key={countdown} className="text-8xl font-black text-primary animate-countdown">
          {countdown}
        </span>
      </div>
    )
  }

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

      {/* Word — swipeable area */}
      <div
        className="flex-1 flex items-center justify-center my-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-sm">
          <WordCard word={currentWord} swipeDir={swipeDir} />
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
