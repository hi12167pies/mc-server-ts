import { PacketIn, PacketOut } from "../../packet/packet";
import { packetMap } from "../../packet/packetMap";
import { BufferReader } from "./bufferReader";
import { Connection } from "../connection";
import * as crpyto from "crypto"

export class PacketReader {
  private reader: BufferReader
  private connection: Connection
  constructor(connection: Connection, reader: BufferReader) {
    this.reader = reader
    this.connection = connection
  }
  
  public async readUncompressedPacket(): Promise<PacketIn | null> {
    const packetLength = await this.reader.readVarInt()
    const packetData = await this.reader.readUnsignedBytes(packetLength)
    const packetReader = new BufferReader(packetData)
    const packetId = await packetReader.readVarInt()

    if (packetLength == 1) {
      return null
    }

    return await this.createPacket(packetId, packetReader)
  }

  private async createPacket(packetId: number, packetReader: BufferReader): Promise<PacketIn | null> {
    const packetStateInfo = packetMap[this.connection.state]

    if (packetStateInfo == undefined) {
      console.log(`(${this.connection.id}) Unknown state ${this.connection.state} (current state: ${this.connection.state})`)
      return null
    }

    const PacketClass = packetStateInfo[packetId]
    if (PacketClass == undefined) {
      console.log(`(${this.connection.id}) Packet id ${packetId} (0x${packetId.toString(16)}) does not exist in state ${this.connection.state}`)
      return null
    }


    let packet
    try {
      packet = new PacketClass()
      await packet.read(packetReader)
    } catch (e) {
      console.error("Failed to create packet", e)
      return null
    }

    return packet
  }
}