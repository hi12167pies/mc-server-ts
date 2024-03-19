import { Connection } from "../net/connection"
import { Packet, PacketIn, PacketOut } from "../packet/packet"

export type PacketHandlerSingle = {
  packet: new () => PacketIn,
  handle: (connection: Connection, packet: any) => Promise<void>
}

export type PacketHandler = PacketHandlerSingle[] | PacketHandlerSingle