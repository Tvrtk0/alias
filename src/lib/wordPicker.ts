export function fisherYatesShuffle(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

export function getNextWord(
  shuffledIndices: number[],
  currentIndex: number,
  totalWords: number,
): { wordIndex: number; newShuffled: number[] | null; newCurrentIndex: number } {
  if (currentIndex < shuffledIndices.length) {
    return {
      wordIndex: shuffledIndices[currentIndex],
      newShuffled: null,
      newCurrentIndex: currentIndex + 1,
    }
  }
  // Reshuffle
  const newShuffled = fisherYatesShuffle(totalWords)
  return {
    wordIndex: newShuffled[0],
    newShuffled,
    newCurrentIndex: 1,
  }
}
