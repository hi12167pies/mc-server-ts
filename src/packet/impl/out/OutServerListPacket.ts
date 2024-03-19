import { BufferWriter } from "../../../net/data/bufferWriter"
import { Connection } from "../../../net/connection"
import { ConnectionState } from "../../../enum/ConnectionState"
import { PacketOut } from "../../packet"

export type OutServerListPingInfo = {
  "version": {
    "name": string,
    "protocol": number
  },
  "players": {
    "max": number,
    "online": number,
    "sample": any[]
  },
  "description": {
    "text": string
  }
}

export class OutServerListPingPacket implements PacketOut {
  info: OutServerListPingInfo
  constructor(info: OutServerListPingInfo) {
    this.info = info
  }

  getId(): number {
    return 0x00
  }

  getState(): ConnectionState {
    return ConnectionState.Status
  }

  async write(writer: BufferWriter) {
    writer.writeJSON(this.info)
  }
}