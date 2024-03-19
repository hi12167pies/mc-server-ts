import { ConnectionState } from "../enum/ConnectionState";
import { BufferReader } from "../net/data/bufferReader";
import { BufferWriter } from "../net/data/bufferWriter";
import { Connection } from "../net/connection";

export interface Packet {
  getId(): number
  getState(): ConnectionState
}

export interface PacketIn extends Packet {
  read(reader: BufferReader): Promise<void>
}

export interface PacketOut extends Packet {
  write(writer: BufferWriter): Promise<void>
}