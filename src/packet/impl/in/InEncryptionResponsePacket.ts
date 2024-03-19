import { BufferReader } from "../../../net/data/bufferReader"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketIn } from "../../packet"

export class InEncryptionResponsePacket implements PacketIn {
  public sharedSecret: Buffer = Buffer.alloc(0)
  public verifyToken: Buffer = Buffer.alloc(0)

  getId(): number {
    return 0x01
  }

  getState(): ConnectionState {
    return ConnectionState.Login
  }

  async read(reader: BufferReader) {
    const secretLength = await reader.readVarInt()
    this.sharedSecret = Buffer.alloc(secretLength)
    const secretBytes = await reader.readUnsignedBytes(secretLength)
    for (let i = 0; i < secretLength; i++) {
      this.sharedSecret[i] = secretBytes[i]
    }

    const verifyLength = await reader.readVarInt()
    this.verifyToken = Buffer.alloc(verifyLength)
    const verifyBytes = await reader.readUnsignedBytes(verifyLength)
    for (let i = 0; i < verifyLength; i++) {
      this.verifyToken[i] = verifyBytes[i]
    }
  }
}