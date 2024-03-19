import { BufferWriter } from "../../../net/data/bufferWriter"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketOut } from "../../packet"

export class OutSetCompressionPacket implements PacketOut {
  public threshhold: number

  constructor(threshold: number) {
    this.threshhold = threshold
  }

  getId(): number {
    return 0x03
  }

  getState(): ConnectionState {
    return ConnectionState.Login
  }

  async write(writer: BufferWriter) {
    writer.writeVarInt(this.threshhold)
  }
}