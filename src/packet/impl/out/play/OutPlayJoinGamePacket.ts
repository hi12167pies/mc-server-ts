import { BufferWriter } from "../../../../net/data/bufferWriter"
import { Connection } from "../../../../net/connection"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { Gamemode } from "../../../../enum/Gamemode"
import { Dimension } from "../../../../enum/Dimension"
import { Difficulty } from "../../../../enum/Difficulty"
import { LevelType } from "../../../../enum/LevelType"

export class OutPlayJoinGamePacket implements PacketOut {
  constructor(
    public entityId: number,
    public gamemode: Gamemode,
    public dimension: Dimension,
    public difficulty: Difficulty,
    public maxPlayers: number,
    public levelType: LevelType,
    public reducedDebugInfo: boolean
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x01
  }

  async write(writer: BufferWriter) {
    writer.writeInt(this.entityId)
    writer.writeUnsignedByte(this.gamemode)
    writer.writeByte(this.dimension)
    writer.writeUnsignedByte(this.difficulty)
    writer.writeUnsignedByte(this.maxPlayers)
    writer.writeString(this.levelType)
    writer.writeBoolean(this.reducedDebugInfo)
  }
}