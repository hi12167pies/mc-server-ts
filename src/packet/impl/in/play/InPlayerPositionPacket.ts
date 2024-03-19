import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InPlayerPositionPacket implements PacketIn {
  public x: number = 0
  public y: number = 0
  public z: number = 0
  public ground: boolean = false

  getId(): number {
    return 0x04
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.x = await reader.readDouble()
    this.y = await reader.readDouble()
    this.z = await reader.readDouble()
    this.ground = await reader.readBoolean()
  }
}