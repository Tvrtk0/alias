import { useGame } from '../../context/GameContext'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

export default function TurnTransition() {
  const { state, dispatch } = useGame()
  const activeTeam = state.teams[state.activeTeamIndex]

  return (
    <PageContainer>
      <div className="text-center space-y-8">
        <p className="text-gray-400 text-lg">Pass the device to</p>
        <h1 className="text-5xl font-bold text-primary">{activeTeam.name}</h1>

        {activeTeam.players.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Explaining</p>
            <p className="text-2xl font-bold text-white">
              {activeTeam.players[state.activePlayerIndices[state.activeTeamIndex]] ?? activeTeam.players[0]}
            </p>
            {activeTeam.players.length > 1 && (
              <p className="text-gray-400 text-sm">
                Guessing: {activeTeam.players
                  .filter((_, i) => i !== state.activePlayerIndices[state.activeTeamIndex])
                  .join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Current scores */}
        <div className="flex justify-center gap-4 flex-wrap">
          {state.teams.map((team, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg text-sm ${
                i === state.activeTeamIndex
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'bg-surface-light text-gray-300'
              }`}
            >
              <span className="font-medium">{team.name}</span>
              <span className="ml-2 font-bold">{team.score}</span>
            </div>
          ))}
        </div>

        <Button onClick={() => dispatch({ type: 'START_TURN' })} size="lg">
          Ready!
        </Button>
      </div>
    </PageContainer>
  )
}
