import { useGame } from '../../context/GameContext'
import words from '../../data/words.json'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

export default function Scoreboard() {
  const { state, dispatch } = useGame()
  const activeTeam = state.teams[state.activeTeamIndex]

  const correct = state.wordResults.filter((w) => w.correct).length
  const skipped = state.wordResults.filter((w) => !w.correct).length
  const roundScore = correct + skipped * state.settings.skipPenalty

  return (
    <PageContainer>
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Round result</h2>

        {/* Round summary */}
        <div className="bg-surface rounded-xl p-4 text-center space-y-2">
          <p className="text-primary font-semibold text-lg">{activeTeam.name}</p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="text-success">✓ {correct}</span>
            <span className="text-danger">✗ {skipped}</span>
          </div>
          <p className="text-3xl font-bold animate-pulse-score">
            {roundScore > 0 ? '+' : ''}
            {roundScore}
          </p>
        </div>

        {/* Word list — tap to toggle */}
        {state.wordResults.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Tap a word to correct
            </p>
            {state.wordResults.map((result, i) => (
              <button
                key={i}
                onClick={() => dispatch({ type: 'TOGGLE_WORD', index: i })}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  result.correct
                    ? 'bg-success/10 text-success'
                    : 'bg-danger/10 text-danger'
                }`}
              >
                <span>{words[result.wordIndex]}</span>
                <span className="text-lg">{result.correct ? '✓' : '✗'}</span>
              </button>
            ))}
          </div>
        )}

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
