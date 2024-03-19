import { Dimension } from "../enum/Dimension";
import { Position } from "../model/position";
import { Block } from "./block";
import { Chunk } from "./chunk";

export class World {
  public chunks: Map<Position, Chunk> = new Map()
  constructor(
    public dimension: Dimension
  ) {
  }

  public setBlock(position: Position, block: Block) {
    this.getChunk(position).setBlock(position, block)
  }

  public getChunk(position: Position): Chunk {
    const chunkPos = {
      x: Math.floor(position.x / 16),
      y: 0,
      z: Math.floor(position.z / 16)
    }
    if (!this.chunks.has(chunkPos)) {
      this.chunks.set(chunkPos, new Chunk(chunkPos.x, chunkPos.z, this.dimension))
    }
    const chunk = this.chunks.get(chunkPos)
    if (chunk == undefined) throw new Error("Failed to create chunk")
    return chunk
  }
}