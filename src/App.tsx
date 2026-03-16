import { useState } from 'react'
import { useGameState } from './hooks/useGameState'
import { useSound } from './hooks/useSound'
import { GameContext } from './context/GameContext'
import SetupScreen from './components/setup/SetupScreen'
import TurnTransition from './components/transition/TurnTransition'
import GameScreen from './components/game/GameScreen'
import Scoreboard from './components/scoreboard/Scoreboard'
import GameOver from './components/scoreboard/GameOver'
import StatsScreen from './components/stats/StatsScreen'

export default function App() {
  const [state, dispatch] = useGameState()
  const [showStats, setShowStats] = useState(false)
  useSound()

  if (showStats) {
    return <StatsScreen onBack={() => setShowStats(false)} />
  }

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {state.phase === 'setup' && <SetupScreen onShowStats={() => setShowStats(true)} />}
      {state.phase === 'turn-transition' && <TurnTransition />}
      {state.phase === 'playing' && <GameScreen />}
      {state.phase === 'turn-summary' && <Scoreboard />}
      {state.phase === 'game-over' && <GameOver />}
    </GameContext.Provider>
  )
}
