import { BufferWriter } from "../../../../net/data/bufferWriter"
import { ConnectionState } from "../../../../enum/ConnectionState"
import { PacketOut } from "../../../packet"
import { ChatMessage } from "../../../../net/chat"

export enum ChatPosition {
  ChatBox = 0,
  SystemMessage = 0,
  Hotbar = 2
}

export class OutChatMessagePacket implements PacketOut {
  constructor(
    public message: ChatMessage,
    public position: ChatPosition
  ) {}

  getState(): ConnectionState {
    return ConnectionState.Play
  }

  getId(): number {
    return 0x02
  }

  async write(writer: BufferWriter) {
    writer.writeChat(this.message)
    writer.writeByte(this.position)
  }
}