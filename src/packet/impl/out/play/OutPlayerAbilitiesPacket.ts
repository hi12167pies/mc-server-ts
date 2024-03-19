import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { Position } from "../../../../model/position"

export enum PlayerAbilityFlag {
  Invulnerable,
  Flying,
  AllowFlying,
  CreativeMode
}

export class OutPlayerAbilitiesPacket implements PacketOut {
  constructor(
    public flySpeed: number,
    public fovModifier: number,
    public flags: PlayerAbilityFlag[]
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x39
  }

  async write(writer: BufferWriter) {
    let flagByte = 0

    if (this.flags.includes(PlayerAbilityFlag.Invulnerable)) flagByte |= 1
    if (this.flags.includes(PlayerAbilityFlag.Flying)) flagByte |= 2
    if (this.flags.includes(PlayerAbilityFlag.AllowFlying)) flagByte |= 4
    if (this.flags.includes(PlayerAbilityFlag.CreativeMode)) flagByte |= 8

    writer.writeByte(flagByte)

    writer.writeFloat(this.flySpeed)
    writer.writeFloat(this.fovModifier)
  }
}