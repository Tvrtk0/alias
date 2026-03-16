interface WordCardProps {
  word: string
}

export default function WordCard({ word }: WordCardProps) {
  return (
    <div className="animate-slide-in bg-surface rounded-2xl p-8 min-h-32 flex items-center justify-center" key={word}>
      <span className="text-3xl font-bold text-white text-center">{word}</span>
    </div>
  )
}
