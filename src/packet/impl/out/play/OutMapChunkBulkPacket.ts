import { ArrayBufferWriter, BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { Chunk } from "../../../../chunk/chunk"
import { Dimension } from "../../../../enum/Dimension"

export class OutMapChunkBulkPacket implements PacketOut {
  constructor(
    public chunks: Chunk[]
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x26
  }

  async write(writer: BufferWriter) {
    // wiki - "Whether or not Chunk Data contains light nibble arrays. This is true in the Overworld, false in the End + Nether"
    writer.writeBoolean(this.chunks[0].dimension == Dimension.Overworld)

    writer.writeVarInt(this.chunks.length)

    const chunkArray = new ArrayBufferWriter()
    const chunkWriter = new BufferWriter(chunkArray)

    // chunk meta
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i]

      // chunk position
      writer.writeInt(chunk.x)
      writer.writeInt(chunk.z)

      // write bitmask
      let mask = 0
      let sectionCount = 0

      for (let i = 0; i < Chunk.SECTIONS; i++) {
        if (chunk.sections[i].blocks.size <= 0) continue
        mask |= 1 << i
        sectionCount++
      }

      writer.writeUnsignedShort(mask)

      // use this to determine the size of the final data
      let totalDataSize = 0
      
      // block data
      const blockData = new Array(8192 * sectionCount).fill(0) // array starts with all 0's for air
      totalDataSize += blockData.length

      for (let i = 0; i < Chunk.SECTIONS; i++) {
        if (chunk.sections[i].blocks.size <= 0) continue
        const section = chunk.sections[i]

        // loop over all blocks in section
        for (const position of section.blocks.keys()) {

          const block = section.blocks.get(position)
          if (block == undefined) return
          
          const i = position.y << 8 | position.z << 4 | position.x

          blockData[2 * i]  = ((block.type << 4) | block.meta)
          blockData[2 * i + 1]  = block.type >> 4

        }
      }

      // block light
      const blockLight = new Array(2048 * sectionCount).fill(0xff)
      totalDataSize += blockLight.length

      // skylight
      const skyLight = new Array(2048 * sectionCount).fill(0xff)
      totalDataSize += skyLight.length

      // biomes
      const biomes = new Array(256).fill(0)
      totalDataSize += biomes.length

      // writing multiple arrays are the same as just writing one big one
      // all data is just written to buffer then sent
      chunkWriter.writeUnsignedByteArray(blockData)
      chunkWriter.writeUnsignedByteArray(blockLight)
      chunkWriter.writeUnsignedByteArray(skyLight)
      chunkWriter.writeUnsignedByteArray(biomes)
    } // for end - i

    
    writer.writeUnsignedByteArray(chunkArray.data)
  }
}