import { BufferReader } from "../../../net/data/bufferReader"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketIn } from "../../packet"

export class InLoginStartPacket implements PacketIn {
  public name: string = ""

  getId(): number {
    return 0x00
  }

  getState(): ConnectionState {
    return ConnectionState.Login
  }

  async read(reader: BufferReader) {
    this.name = await reader.readString()
  }
}