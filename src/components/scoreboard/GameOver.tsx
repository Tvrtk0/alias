import { useEffect, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { playSound } from '../../lib/sounds'
import { saveGameResult } from '../../lib/stats'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

const CONFETTI = ['🎉', '🎊', '✨', '⭐', '🌟', '💫', '🎇']

function ConfettiParticle({ delay, emoji }: { delay: number; emoji: string }) {
  return (
    <span
      className="absolute text-2xl animate-confetti pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay}ms`,
      }}
    >
      {emoji}
    </span>
  )
}

export default function GameOver() {
  const { state, dispatch } = useGame()
  const sorted = state.teams.slice().sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const [showScores, setShowScores] = useState(false)

  useEffect(() => {
    playSound('victory')
    saveGameResult(
      state.teams.map((t) => ({ name: t.name, score: t.score })),
      winner.name,
    )
    const timer = setTimeout(() => setShowScores(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const confettiPieces = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 150,
    emoji: CONFETTI[i % CONFETTI.length],
  }))

  return (
    <PageContainer>
      <div className="w-full max-w-sm space-y-8 text-center relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map((p, i) => (
            <ConfettiParticle key={i} delay={p.delay} emoji={p.emoji} />
          ))}
        </div>

        <div className="animate-celebration">
          <p className="text-7xl mb-4 animate-trophy-bounce">🏆</p>
          <h1 className="text-4xl font-bold text-primary animate-winner-glow">{winner.name}</h1>
          <p className="text-gray-400 mt-2">wins with {winner.score} points!</p>
        </div>

        {/* Final scores — staggered entrance */}
        <div className={`space-y-2 transition-all duration-500 ${showScores ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {sorted.map((team, i) => (
            <div
              key={i}
              className={`flex justify-between items-center rounded-lg px-4 py-3 ${
                i === 0 ? 'bg-primary/20 border border-primary/30' : 'bg-surface-light'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
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
