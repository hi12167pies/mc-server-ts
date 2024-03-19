import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InPlayerLookPacket implements PacketIn {
  public yaw: number = 0
  public pitch: number = 0
  public ground: boolean = false

  getId(): number {
    return 0x05
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.yaw = await reader.readFloat()
    this.pitch = await reader.readFloat()
    this.ground = await reader.readBoolean()
  }
}