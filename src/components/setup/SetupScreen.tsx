import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

const TIME_OPTIONS = [30, 45, 60, 90]
const SCORE_OPTIONS = [25, 50, 75, 100]
const PENALTY_OPTIONS = [0, -1]

interface TeamSetup {
  name: string
  players: string[]
}

interface SetupScreenProps {
  onShowStats: () => void
}

const makeTeam = (): TeamSetup => ({ name: '', players: ['', ''] })

export default function SetupScreen({ onShowStats }: SetupScreenProps) {
  const { dispatch } = useGame()
  const [teams, setTeams] = useState<TeamSetup[]>([makeTeam(), makeTeam()])
  const [roundTime, setRoundTime] = useState(60)
  const [targetScore, setTargetScore] = useState(50)
  const [skipPenalty, setSkipPenalty] = useState(-1)

  const updateTeamName = (ti: number, val: string) => {
    const next = [...teams]
    next[ti] = { ...next[ti], name: val }
    setTeams(next)
  }

  const updatePlayer = (ti: number, pi: number, val: string) => {
    const next = [...teams]
    const players = [...next[ti].players]
    players[pi] = val
    next[ti] = { ...next[ti], players }
    setTeams(next)
  }

  const addPlayer = (ti: number) => {
    const next = [...teams]
    next[ti] = { ...next[ti], players: [...next[ti].players, ''] }
    setTeams(next)
  }

  const removePlayer = (ti: number, pi: number) => {
    const next = [...teams]
    next[ti] = { ...next[ti], players: next[ti].players.filter((_, i) => i !== pi) }
    setTeams(next)
  }

  const addTeam = () => {
    if (teams.length < 4) setTeams([...teams, makeTeam()])
  }

  const removeTeam = (ti: number) => {
    if (teams.length > 2) setTeams(teams.filter((_, i) => i !== ti))
  }

  const startGame = () => {
    const gameTeams = teams.map((t, i) => ({
      name: t.name.trim() || `Team ${i + 1}`,
      players: t.players
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
      score: 0,
    }))
    dispatch({
      type: 'START_GAME',
      teams: gameTeams,
      settings: { roundTime, targetScore, skipPenalty },
    })
  }

  return (
    <PageContainer>
      <h1 className="text-4xl font-bold mb-8">Alias</h1>
      <div className="w-full max-w-sm space-y-6">
        {/* Teams */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Teams</h2>
          {teams.map((team, ti) => (
            <div key={ti} className="bg-surface rounded-xl p-4 space-y-3">
              {/* Team name row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => updateTeamName(ti, e.target.value)}
                  placeholder={`Team ${ti + 1}`}
                  maxLength={20}
                  className="flex-1 bg-surface-light border border-surface-light rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary font-semibold"
                />
                {teams.length > 2 && (
                  <button
                    onClick={() => removeTeam(ti)}
                    className="text-gray-400 hover:text-danger text-xl w-8 h-8 flex items-center justify-center cursor-pointer"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Player inputs */}
              <div className="space-y-2 pl-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Players</p>
                {team.players.map((player, pi) => (
                  <div key={pi} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayer(ti, pi, e.target.value)}
                      placeholder={`Player ${pi + 1}`}
                      maxLength={20}
                      className="flex-1 bg-bg border border-surface-light rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    {team.players.length > 1 && (
                      <button
                        onClick={() => removePlayer(ti, pi)}
                        className="text-gray-500 hover:text-danger text-sm w-6 h-6 flex items-center justify-center cursor-pointer"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addPlayer(ti)}
                  className="text-primary/70 text-xs font-medium cursor-pointer hover:text-primary"
                >
                  + Add player
                </button>
              </div>
            </div>
          ))}
          {teams.length < 4 && (
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

        <button
          onClick={onShowStats}
          className="w-full text-center text-gray-400 hover:text-white text-sm cursor-pointer py-2"
        >
          View statistics
        </button>
      </div>
    </PageContainer>
  )
}
