export type Position = {
  x: number, y: number, z: number
}

export type PlayerPosition = Position & {
  yaw: number, pitch: number,
  ground: boolean
}
