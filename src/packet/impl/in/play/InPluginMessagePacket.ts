import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InPluginMessagePacket implements PacketIn {
  public channel: string = ""
  public data: number[] = []
  getId(): number {
    return 0x17
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.channel = await reader.readString()
    this.data = await reader.readUnsignedBytes(reader.getDataAvailable())
  }
}