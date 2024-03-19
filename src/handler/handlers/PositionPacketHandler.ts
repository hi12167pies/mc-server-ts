import { InOnGroundPacket } from "../../packet/impl/in/play/InOnGroundPacket";
import { InPlayerLookPacket } from "../../packet/impl/in/play/InPlayerLookPacket";
import { InPlayerPositionLookPacket } from "../../packet/impl/in/play/InPlayerPositionLookPacket";
import { InPlayerPositionPacket } from "../../packet/impl/in/play/InPlayerPositionPacket";
import { PacketHandler } from "../packetHander";

export const PositionPacketHandler: PacketHandler = [
  {
    packet: InPlayerPositionPacket,
    async handle(connection, packet: InPlayerPositionPacket) {
      connection.player.position.x = packet.x
      connection.player.position.y = packet.y
      connection.player.position.z = packet.z
      connection.player.position.ground = packet.ground
    }
  },
  {
    packet: InPlayerPositionLookPacket,
    async handle(connection, packet: InPlayerPositionLookPacket) {
      connection.player.position.x = packet.x
      connection.player.position.y = packet.y
      connection.player.position.z = packet.z
      connection.player.position.yaw = packet.yaw
      connection.player.position.pitch = packet.pitch
      connection.player.position.ground = packet.ground
    }
  },
  {
    packet: InOnGroundPacket,
    async handle(connection, packet: InOnGroundPacket) {  
      connection.player.position.ground = packet.ground
    }
  },
  {
    packet: InPlayerLookPacket,
    async handle(connection, packet: InPlayerLookPacket) {  
      connection.player.position.yaw = packet.yaw
      connection.player.position.pitch = packet.pitch
      connection.player.position.ground = packet.ground
    }
  },
]
