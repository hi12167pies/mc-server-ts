import { BufferWriter } from "../../../net/data/bufferWriter"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketOut } from "../../packet"

export class OutLoginSuccessPacket implements PacketOut {
  public uuid: string
  public name: string
  constructor(uuid: string, name: string) {
    this.uuid = uuid
    this.name = name
  }

  getState(): ConnectionState {
    return ConnectionState.Login
  }

  getId(): number {
    return 0x02
  }

  async write(writer: BufferWriter) {
    writer.writeString(this.uuid)
    writer.writeString(this.name)
  }
}