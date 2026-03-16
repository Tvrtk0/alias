import { useGame } from '../../context/GameContext'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

export default function Scoreboard() {
  const { state, dispatch } = useGame()
  const activeTeam = state.teams[state.activeTeamIndex]
  const roundScore =
    state.currentRoundCorrect + state.currentRoundSkipped * state.settings.skipPenalty

  return (
    <PageContainer>
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Round result</h2>

        {/* Round summary for active team */}
        <div className="bg-surface rounded-xl p-4 text-center space-y-2">
          <p className="text-primary font-semibold text-lg">{activeTeam.name}</p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-success">✓ {state.currentRoundCorrect}</span>
            <span className="text-danger">✗ {state.currentRoundSkipped}</span>
          </div>
          <p className="text-3xl font-bold animate-pulse-score">
            {roundScore > 0 ? '+' : ''}
            {roundScore}
          </p>
        </div>

        {/* All team scores */}
        <div className="space-y-2">
          <h3 className="text-sm text-gray-400 font-medium uppercase tracking-wider">Overall scores</h3>
          {state.teams
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((team, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-surface-light rounded-lg px-4 py-3"
              >
                <span className="font-medium">{team.name}</span>
                <span className="font-bold text-lg">{team.score}</span>
              </div>
            ))}
        </div>

        <Button onClick={() => dispatch({ type: 'NEXT_TURN' })} size="lg" className="w-full">
          Next round
        </Button>
      </div>
    </PageContainer>
  )
}
