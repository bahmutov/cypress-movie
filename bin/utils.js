/**
 * Converts ms since the start of the video to
 * what ffmpeg expects HH:MM:SS.mmm
 */
const msToTimestamp = (ms) => {
  const hours = Math.floor(ms / (3600 * 1000))
  ms = ms % (3600 * 1000)
  const minutes = Math.floor(ms / (60 * 1000))
  ms = ms % (60 * 1000)
  const seconds = Math.floor(ms / 1000)
  ms = ms % 1000

  // need to pad numbers to form
  const HH = String(hours).padStart(2, '0')
  const MM = String(minutes).padStart(2, '0')
  const SS = String(seconds).padStart(2, '0')
  const mmm = String(ms).padStart(3, '0')
  return `${HH}:${MM}:${SS}.${mmm}`
}

module.exports = { msToTimestamp }
