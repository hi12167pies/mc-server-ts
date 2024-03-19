import { BufferWriter } from "../../../net/data/bufferWriter"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketOut } from "../../packet"

export class OutPongPacket implements PacketOut {
  public payload: number

  constructor(payload: number) {
    this.payload = payload
  }

  getState(): ConnectionState {
    return ConnectionState.Status
  }

  getId(): number {
    return 0x01
  }

  async write(writer: BufferWriter) {
    writer.writeLong(this.payload)
  }
}