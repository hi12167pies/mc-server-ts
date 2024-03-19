import { ConnectionState } from "../../../enum/ConnectionState";
import { BufferWriter } from "../../../net/data/bufferWriter";
import { getKeyBytes } from "../../../utils/encryptionUtils";
import { PacketOut } from "../../packet";
import * as crypto from "crypto"

export class OutEncryptionRequestPacket implements PacketOut {
  constructor(
    public publicKey: crypto.KeyObject,
    public verifyToken: Buffer
  ) {}

  getId(): number {
    return 0x01
  }
  
  getState(): ConnectionState {
    return ConnectionState.Login
  }

  async write(writer: BufferWriter) {
    writer.writeString("") // server id - empty acoording to wiki

    const keyBytes = getKeyBytes(this.publicKey)
    writer.writeVarInt(keyBytes.byteLength)
    writer.writeBuffer(keyBytes)

    writer.writeVarInt(this.verifyToken.byteLength)
    writer.writeBuffer(this.verifyToken)
  }
}