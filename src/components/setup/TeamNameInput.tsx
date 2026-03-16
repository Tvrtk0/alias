interface TeamNameInputProps {
  index: number
  value: string
  onChange: (value: string) => void
  onRemove?: () => void
}

export default function TeamNameInput({ index, value, onChange, onRemove }: TeamNameInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Team ${index + 1}`}
        maxLength={20}
        className="flex-1 bg-surface-light border border-surface rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-danger text-xl w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  )
}
