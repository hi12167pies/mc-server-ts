import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { Position } from "../../../../model/position"

export class OutSpawnPositionPacket implements PacketOut {
  constructor(
    public position: Position
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x05
  }

  async write(writer: BufferWriter) {
    writer.writePosition(this.position)
  }
}