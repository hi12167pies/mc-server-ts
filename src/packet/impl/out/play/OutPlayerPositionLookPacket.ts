import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { PlayerPosition } from "../../../../model/position"

export class OutPlayerPositionLookPacket implements PacketOut {
  constructor(
    public position: PlayerPosition
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x08
  }

  async write(writer: BufferWriter) {
    writer.writeDouble(this.position.x)
    writer.writeDouble(this.position.y)
    writer.writeDouble(this.position.z)
    writer.writeFloat(this.position.yaw)
    writer.writeFloat(this.position.pitch)
    writer.writeByte(0) // relative bitflag - https://wiki.vg/index.php?title=Protocal&oldid=7407#Player_Position_And_Look
  }
}