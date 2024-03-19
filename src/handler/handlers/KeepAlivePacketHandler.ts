import { InPingPacket } from "../../packet/impl/in/InPingPacket";
import { InKeepAlivePacket } from "../../packet/impl/in/play/InKeepAlivePacket";
import { OutPongPacket } from "../../packet/impl/out/OutPongPacket";
import { OutKeepAlivePacket } from "../../packet/impl/out/play/OutKeepAlivePacket";
import { PacketHandler } from "../packetHander";

export const KeepAlivePacketHandler: PacketHandler = [
  {
    packet: InPingPacket,
    async handle(connection, packet: InPingPacket) {
      connection.sendPacket(new OutPongPacket(packet.payload))
    }
  },

  {
    packet: InKeepAlivePacket,
    async handle(connection, packet: InKeepAlivePacket) {
      connection.sendPacket(new OutKeepAlivePacket(packet.id))
    }
  }
]