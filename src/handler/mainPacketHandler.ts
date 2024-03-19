import { Connection } from "../net/connection";
import { Packet, PacketIn, PacketOut } from "../packet/packet";
import { InPingPacket } from "../packet/impl/in/InPingPacket";
import { OutPongPacket } from "../packet/impl/out/OutPongPacket";
import { InKeepAlivePacket } from "../packet/impl/in/play/InKeepAlivePacket";
import { OutKeepAlivePacket } from "../packet/impl/out/play/OutKeepAlivePacket";
import { InChatMessagePacket } from "../packet/impl/in/play/InChatMessagePacket";
import { ChatPosition, OutChatMessagePacket } from "../packet/impl/out/play/OutChatMessagePacket";
import { ChatMessage } from "../net/chat";
import { PacketHandler, PacketHandlerSingle } from "./packetHander";
import { PositionPacketHandler } from "./handlers/PositionPacketHandler";
import { LoginPacketHandler, initPlayer } from "./handlers/LoginPacketHandler";
import { KeepAlivePacketHandler } from "./handlers/KeepAlivePacketHandler";


export const activeConnections: Set<Connection> = new Set()

export function broadcastPacket(packet: PacketOut) {
  activeConnections.forEach(other => other.sendPacket(packet))
}

const handlerMap: Map<new () => PacketIn, any> = new Map()

export async function registerSinglePacketHandler(handler: PacketHandlerSingle) {
  handlerMap.set(handler.packet, handler.handle)
}

export async function registerPacketHandlers(packetHandlers: PacketHandler[]) {
  for (let i = 0; i < packetHandlers.length; i++) {
    const handler = packetHandlers[i]
    if (handler instanceof Array) {
      for (let j = 0; j < handler.length; j++) {
        registerSinglePacketHandler(handler[j])
      }
      continue
    }
    registerSinglePacketHandler(handler)
  }
}

export async function packetHandlerMain() {
  registerPacketHandlers([
    PositionPacketHandler,
    LoginPacketHandler,
    KeepAlivePacketHandler
  ])
}

export async function handlePacket(connection: Connection, packet: Packet) {
  if (packet instanceof InChatMessagePacket) {
    broadcastPacket(new OutChatMessagePacket(new ChatMessage(`<${connection.player.info.username}> ${packet.message}`), ChatPosition.ChatBox))
  }

  // packet handler
  const h = handlerMap.get(packet.constructor as new () => PacketIn)
  if (h) {
    await h(connection, packet)
  }
}
