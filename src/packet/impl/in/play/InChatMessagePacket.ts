import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InChatMessagePacket implements PacketIn {
  public message: string = ""

  getId(): number {
    return 0x01
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.message = await reader.readString()
  }
}