import { ConnectionState } from "../../../enum/ConnectionState";
import { ChatMessage } from "../../../net/chat";
import { BufferWriter } from "../../../net/data/bufferWriter";
import { getKeyBytes } from "../../../utils/encryptionUtils";
import { PacketOut } from "../../packet";
import * as crypto from "crypto"

export class OutLoginDisconnectPacket implements PacketOut {
  constructor(
    public reason: ChatMessage,
  ) {}

  getId(): number {
    return 0x00
  }
  
  getState(): ConnectionState {
    return ConnectionState.Login
  }

  async write(writer: BufferWriter) {
    writer.writeChat(this.reason)
  }
}