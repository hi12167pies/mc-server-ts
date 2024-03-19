import { BufferReader } from "../../../net/data/bufferReader"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketIn } from "../../packet"

export class InPingPacket implements PacketIn {
  public payload: number = 0

  getId(): number {
    return 0x01
  }

  getState(): ConnectionState {
    return ConnectionState.Status
  }

  async read(reader: BufferReader) {
    this.payload = await reader.readLong()
  }
}