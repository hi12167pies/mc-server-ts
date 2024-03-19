import { activeConnections, broadcastPacket, handlePacket, packetHandlerMain } from "./handler/mainPacketHandler";
import { ProtocolServer } from "./net/server";
import { OutKeepAlivePacket } from "./packet/impl/out/play/OutKeepAlivePacket";
import { Packet } from "./packet/packet";
import config from "../config.json"

const server = new ProtocolServer()

packetHandlerMain()

// keep-alive packets
setInterval(() => {
  activeConnections.forEach(connection => {
    broadcastPacket(new OutKeepAlivePacket(1))
  })
}, 20e3)

// handle connections
server.onConnection(async connection => {
  while (true) {
    let packet: Packet | null
    try {
      packet = await connection.readPacket()
    } catch (e) {
      console.log("Connection error", e)
      connection.socket.end()
      break
    }

    if (packet == null) continue

    await handlePacket(connection, packet)
  }
})

server.listen(config.port, () => {
  console.log("Server online listening on port " + config.port)
})