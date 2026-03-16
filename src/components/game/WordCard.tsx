interface WordCardProps {
  word: string
  swipeDir?: 'left' | 'right' | null
}

export default function WordCard({ word, swipeDir }: WordCardProps) {
  let swipeClass = ''
  if (swipeDir === 'right') swipeClass = 'animate-swipe-right'
  if (swipeDir === 'left') swipeClass = 'animate-swipe-left'

  return (
    <div
      className={`animate-slide-in bg-surface rounded-2xl p-8 min-h-32 flex items-center justify-center ${swipeClass}`}
      key={word}
    >
      <span className="text-3xl font-bold text-white text-center">{word}</span>
    </div>
  )
}
