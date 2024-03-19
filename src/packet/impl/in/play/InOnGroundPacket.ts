import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InOnGroundPacket implements PacketIn {
  public ground: boolean = false

  getId(): number {
    return 0x03
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.ground = await reader.readBoolean()
  }
}