import { BufferReader } from "../../../net/data/bufferReader"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketIn } from "../../packet"

export class InServerHandshakePacket implements PacketIn {
  public protocolVersion: number = 0
  public address: string = ""
  public port: number = 0
  public nextState: number = 0

  getId(): number {
    return 0x00
  }

  getState(): ConnectionState {
    return ConnectionState.Handshaking
  }

  async read(reader: BufferReader) {
    this.protocolVersion = await reader.readVarInt()
    this.address = await reader.readString()
    this.port = await reader.readUnsignedShort()
    this.nextState = await reader.readVarInt()
  }
}