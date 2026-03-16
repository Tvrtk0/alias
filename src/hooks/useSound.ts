import { useCallback, useEffect } from 'react'
import { preloadSounds, unlockAudio, playSound, type SoundName } from '../lib/sounds'

export function useSound() {
  useEffect(() => {
    preloadSounds()
    const handler = () => unlockAudio()
    document.addEventListener('touchstart', handler, { once: true })
    document.addEventListener('click', handler, { once: true })
    return () => {
      document.removeEventListener('touchstart', handler)
      document.removeEventListener('click', handler)
    }
  }, [])

  const play = useCallback((name: SoundName) => {
    playSound(name)
  }, [])

  return { play }
}
