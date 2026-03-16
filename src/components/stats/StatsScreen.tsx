import { useState, useEffect } from 'react'
import { loadStats, clearStats } from '../../lib/stats'
import type { GameStats } from '../../types'
import PageContainer from '../layout/PageContainer'
import Button from '../ui/Button'

interface StatsScreenProps {
  onBack: () => void
}

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const [stats, setStats] = useState<GameStats | null>(null)

  useEffect(() => {
    setStats(loadStats())
  }, [])

  if (!stats) return null

  const hasData = stats.gamesPlayed > 0

  const handleClear = () => {
    clearStats()
    setStats(loadStats())
  }

  return (
    <PageContainer>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Statistics</h1>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white text-sm cursor-pointer"
          >
            Back
          </button>
        </div>

        {!hasData ? (
          <p className="text-gray-400 text-center py-8">No games played yet.</p>
        ) : (
          <>
            {/* Overview */}
            <div className="bg-surface rounded-xl p-4 space-y-2">
              <p className="text-gray-400 text-sm">Games played</p>
              <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
            </div>

            {/* Win leaderboard */}
            {Object.keys(stats.wins).length > 0 && (
              <div className="bg-surface rounded-xl p-4 space-y-3">
                <p className="text-gray-400 text-sm">Wins</p>
                {Object.entries(stats.wins)
                  .sort(([, a], [, b]) => b - a)
                  .map(([team, count]) => (
                    <div key={team} className="flex justify-between items-center">
                      <span className="font-medium">{team}</span>
                      <span className="text-primary font-bold">{count}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Recent games */}
            {stats.recentGames.length > 0 && (
              <div className="bg-surface rounded-xl p-4 space-y-3">
                <p className="text-gray-400 text-sm">Recent games</p>
                {stats.recentGames.slice(0, 10).map((game, i) => (
                  <div key={i} className="text-sm border-b border-surface-light pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="text-primary font-medium">{game.winner}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(game.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {game.teams.map((t, j) => `${t}: ${game.scores[j]}`).join(' / ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button variant="danger" onClick={handleClear} className="w-full">
              Clear statistics
            </Button>
          </>
        )}
      </div>
    </PageContainer>
  )
}
