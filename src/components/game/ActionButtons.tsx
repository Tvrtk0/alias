interface ActionButtonsProps {
  onCorrect: () => void
  onSkip: () => void
  disabled?: boolean
}

export default function ActionButtons({ onCorrect, onSkip, disabled }: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onSkip}
        disabled={disabled}
        className="flex-1 py-5 rounded-2xl bg-danger/20 text-danger text-2xl font-bold active:bg-danger/30 transition-colors disabled:opacity-50 cursor-pointer"
      >
        ✗
      </button>
      <button
        onClick={onCorrect}
        disabled={disabled}
        className="flex-1 py-5 rounded-2xl bg-success/20 text-success text-2xl font-bold active:bg-success/30 transition-colors disabled:opacity-50 cursor-pointer"
      >
        ✓
      </button>
    </div>
  )
}
