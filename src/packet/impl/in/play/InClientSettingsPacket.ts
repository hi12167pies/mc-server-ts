import { ConnectionState } from "../../../../enum/ConnectionState"
import { BufferReader } from "../../../../net/data/bufferReader"
import { PacketIn } from "../../../packet"

export class InClientSettingsPacket implements PacketIn {
  public locale: string = ""
  public viewDistance: number = 0
  public chatMode: number = 0
  public chatColors: boolean = false
  public displayedSkinParts: number = 0

  getId(): number {
    return 0x15
  }

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  async read(reader: BufferReader) {
    this.locale = await reader.readString()
    this.viewDistance = await reader.readByte()
    this.chatMode = await reader.readByte()
    this.chatColors = await reader.readBoolean()
    this.displayedSkinParts = await reader.readUnsignedByte()
  }
}