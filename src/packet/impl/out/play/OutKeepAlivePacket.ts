import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"

export class OutKeepAlivePacket implements PacketOut {
  constructor(
    public id: number
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x00
  }

  async write(writer: BufferWriter) {
    writer.writeVarInt(this.id)
  }
}