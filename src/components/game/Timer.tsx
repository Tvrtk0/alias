interface TimerProps {
  secondsLeft: number
  total: number
}

export default function Timer({ secondsLeft, total }: TimerProps) {
  const pct = secondsLeft / total
  const color = pct > 0.5 ? 'text-success' : pct > 0.2 ? 'text-warning' : 'text-danger'
  const bgColor = pct > 0.5 ? 'bg-success' : pct > 0.2 ? 'bg-warning' : 'bg-danger'

  return (
    <div className="text-center space-y-2">
      <span className={`text-6xl font-mono font-bold tabular-nums ${color} transition-colors`}>
        {secondsLeft}
      </span>
      <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} transition-all duration-1000 ease-linear rounded-full`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
