import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { Difficulty } from "../../../../enum/Difficulty"

export class OutServerDifficultyPacket implements PacketOut {
  constructor(
    public difficulty: Difficulty
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x41
  }

  async write(writer: BufferWriter) {
    writer.writeUnsignedByte(this.difficulty)
  }
}