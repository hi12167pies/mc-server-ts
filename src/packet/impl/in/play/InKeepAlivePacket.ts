import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InKeepAlivePacket implements PacketIn {
  public id: number = 0

  getId(): number {
    return 0x00
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.id = await reader.readVarInt()
  }
}