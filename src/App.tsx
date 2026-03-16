import { useGameState } from './hooks/useGameState'
import { useSound } from './hooks/useSound'
import { GameContext } from './context/GameContext'
import SetupScreen from './components/setup/SetupScreen'
import TurnTransition from './components/transition/TurnTransition'
import GameScreen from './components/game/GameScreen'
import Scoreboard from './components/scoreboard/Scoreboard'
import GameOver from './components/scoreboard/GameOver'

export default function App() {
  const [state, dispatch] = useGameState()
  useSound()

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {state.phase === 'setup' && <SetupScreen />}
      {state.phase === 'turn-transition' && <TurnTransition />}
      {state.phase === 'playing' && <GameScreen />}
      {state.phase === 'turn-summary' && <Scoreboard />}
      {state.phase === 'game-over' && <GameOver />}
    </GameContext.Provider>
  )
}
