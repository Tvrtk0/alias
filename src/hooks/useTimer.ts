import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(
  duration: number,
  onTick?: (secondsLeft: number) => void,
  onEnd?: () => void,
) {
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTickRef = useRef(onTick)
  const onEndRef = useRef(onEnd)

  onTickRef.current = onTick
  onEndRef.current = onEnd

  const start = useCallback(() => {
    setSecondsLeft(duration)
    setIsRunning(true)
  }, [duration])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setIsRunning(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          onEndRef.current?.()
          return 0
        }
        onTickRef.current?.(next)
        return next
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning])

  return { secondsLeft, isRunning, start, stop }
}
