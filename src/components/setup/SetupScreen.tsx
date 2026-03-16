import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'
import TeamNameInput from './TeamNameInput'

const TIME_OPTIONS = [30, 45, 60, 90]
const SCORE_OPTIONS = [25, 50, 75, 100]
const PENALTY_OPTIONS = [0, -1]

export default function SetupScreen() {
  const { dispatch } = useGame()
  const [teamNames, setTeamNames] = useState(['', ''])
  const [roundTime, setRoundTime] = useState(60)
  const [targetScore, setTargetScore] = useState(50)
  const [skipPenalty, setSkipPenalty] = useState(-1)

  const updateTeam = (i: number, val: string) => {
    const next = [...teamNames]
    next[i] = val
    setTeamNames(next)
  }

  const addTeam = () => {
    if (teamNames.length < 4) setTeamNames([...teamNames, ''])
  }

  const removeTeam = (i: number) => {
    if (teamNames.length > 2) setTeamNames(teamNames.filter((_, idx) => idx !== i))
  }

  const startGame = () => {
    const teams = teamNames.map((name, i) => ({
      name: name.trim() || `Team ${i + 1}`,
      score: 0,
    }))
    dispatch({
      type: 'START_GAME',
      teams,
      settings: { roundTime, targetScore, skipPenalty },
    })
  }

  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">Alias</h1>
      <div className="w-full max-w-sm space-y-6">
        {/* Teams */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">Teams</h2>
          {teamNames.map((name, i) => (
            <TeamNameInput
              key={i}
              index={i}
              value={name}
              onChange={(v) => updateTeam(i, v)}
              onRemove={teamNames.length > 2 ? () => removeTeam(i) : undefined}
            />
          ))}
          {teamNames.length < 4 && (
            <button
              onClick={addTeam}
              className="text-primary text-sm font-medium cursor-pointer"
            >
              + Add team
            </button>
          )}
        </section>

        {/* Round Time */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-300">Round time</h2>
          <div className="flex gap-2">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setRoundTime(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  roundTime === t
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-gray-300 hover:bg-surface'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </section>

        {/* Target Score */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-300">Target score</h2>
          <div className="flex gap-2">
            {SCORE_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setTargetScore(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  targetScore === s
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-gray-300 hover:bg-surface'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Skip Penalty */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-300">Skip penalty</h2>
          <div className="flex gap-2">
            {PENALTY_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setSkipPenalty(p)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  skipPenalty === p
                    ? 'bg-primary text-white'
                    : 'bg-surface-light text-gray-300 hover:bg-surface'
                }`}
              >
                {p === 0 ? 'None' : `${p} point`}
              </button>
            ))}
          </div>
        </section>

        <Button onClick={startGame} size="lg" className="w-full">
          Start game
        </Button>
      </div>
    </PageContainer>
  )
}
