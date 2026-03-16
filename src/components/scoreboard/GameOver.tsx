import { useEffect } from 'react'
import { useGame } from '../../context/GameContext'
import { playSound } from '../../lib/sounds'
import { saveGameResult } from '../../lib/stats'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

export default function GameOver() {
  const { state, dispatch } = useGame()
  const sorted = state.teams.slice().sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  useEffect(() => {
    playSound('victory')
    saveGameResult(
      state.teams.map((t) => ({ name: t.name, score: t.score })),
      winner.name,
    )
  }, [])

  return (
    <PageContainer>
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="animate-celebration">
          <p className="text-6xl mb-4">🏆</p>
          <h1 className="text-4xl font-bold text-primary">{winner.name}</h1>
          <p className="text-gray-400 mt-2">wins with {winner.score} points!</p>
        </div>

        {/* Final scores */}
        <div className="space-y-2">
          {sorted.map((team, i) => (
            <div
              key={i}
              className={`flex justify-between items-center rounded-lg px-4 py-3 ${
                i === 0 ? 'bg-primary/20 border border-primary/30' : 'bg-surface-light'
              }`}
            >
              <span className="font-medium">
                {i === 0 && '🥇 '}
                {i === 1 && '🥈 '}
                {i === 2 && '🥉 '}
                {team.name}
              </span>
              <span className="font-bold text-lg">{team.score}</span>
            </div>
          ))}
        </div>

        <Button onClick={() => dispatch({ type: 'RESET' })} size="lg" className="w-full">
          New game
        </Button>
      </div>
    </PageContainer>
  )
}
