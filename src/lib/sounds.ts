const soundCache = new Map<string, HTMLAudioElement>()
let audioUnlocked = false

const SOUND_FILES = ['correct', 'skip', 'tick', 'time-up', 'victory', 'countdown'] as const
export type SoundName = (typeof SOUND_FILES)[number]

export function preloadSounds() {
  for (const name of SOUND_FILES) {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${name}.mp3`)
    audio.preload = 'auto'
    soundCache.set(name, audio)
  }
}

export function unlockAudio() {
  if (audioUnlocked) return
  audioUnlocked = true
  // Play a silent buffer to unlock audio on iOS Safari
  for (const audio of soundCache.values()) {
    audio.play().then(() => audio.pause()).catch(() => {})
    audio.currentTime = 0
  }
}

export function playSound(name: SoundName) {
  const audio = soundCache.get(name)
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {})
}
