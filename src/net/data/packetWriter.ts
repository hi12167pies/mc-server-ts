import { PacketOut } from "../../packet/packet"
import { Connection } from "../connection"
import { ArrayBufferWriter, BufferWriter } from "./bufferWriter"

export class PacketWriter {
  constructor(
    public connection: Connection,
    public writer: BufferWriter
  ) {}

  public writeUncompressedPacket(packet: PacketOut) {
    const data = new ArrayBufferWriter()
    const writer = new BufferWriter(data)

    writer.writeVarInt(packet.getId())
    packet.write(writer)
    
    this.writer.writeVarInt(data.data.length)
    this.writer.writeUnsignedByteArray(data.data)
  }
}