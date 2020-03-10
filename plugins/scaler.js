const SCALE = 4
const scaleUp = (n) => {
  return n * SCALE
}

const scaleDown = (n) => {
  return n / SCALE
}

export {
  scaleUp,
  scaleDown
}
