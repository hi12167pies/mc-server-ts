import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InPlayerPositionLookPacket implements PacketIn {
  public x: number = 0
  public y: number = 0
  public z: number = 0
  public yaw: number = 0
  public pitch: number = 0
  public ground: boolean = false

  getId(): number {
    return 0x06
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.x = await reader.readDouble()
    this.y = await reader.readDouble()
    this.z = await reader.readDouble()
    this.yaw = await reader.readFloat()
    this.pitch = await reader.readFloat()
    this.ground = await reader.readBoolean()
  }
}