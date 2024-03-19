import { read } from "fs"
import { BufferReader } from "../src/net/data/bufferReader"
import { ArrayBufferWriter, BufferWriter } from "../src/net/data/bufferWriter"
import { OutLoginSuccessPacket } from "../src/packet/impl/out/OutLoginSuccessPacket"
import { PacketWriter } from "../src/net/data/packetWriter"
import { PacketReader } from "../src/net/data/packetReader"
import { Connection } from "../src/net/connection"
import { ConnectionState } from "../src/enum/ConnectionState"

async function main() {
  const writerData = new ArrayBufferWriter()
  const writer = new BufferWriter(writerData)
  
  writer.writeInt(5)


  console.log(writerData.data)
}

main()