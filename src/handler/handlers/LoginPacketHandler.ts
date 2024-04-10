import { Chunk } from "../../chunk/chunk";
import { ConnectionState } from "../../enum/ConnectionState";
import { Difficulty } from "../../enum/Difficulty";
import { Dimension } from "../../enum/Dimension";
import { Gamemode } from "../../enum/Gamemode";
import { LevelType } from "../../enum/LevelType";
import { Connection } from "../../net/connection";
import { InServerHandshakePacket } from "../../packet/impl/in/InHandeshakePacket";
import { OutLoginSuccessPacket } from "../../packet/impl/out/OutLoginSuccessPacket";
import { OutServerListPingPacket } from "../../packet/impl/out/OutServerListPacket";
import { OutSetCompressionPacket } from "../../packet/impl/out/OutSetCompressionPacket";
import { OutMapChunkBulkPacket } from "../../packet/impl/out/play/OutMapChunkBulkPacket";
import { OutPlayJoinGamePacket } from "../../packet/impl/out/play/OutPlayJoinGamePacket";
import { OutPlayerPositionLookPacket } from "../../packet/impl/out/play/OutPlayerPositionLookPacket";
import { OutServerDifficultyPacket } from "../../packet/impl/out/play/OutServerDifficultyPacket";
import { OutSpawnPositionPacket } from "../../packet/impl/out/play/OutSpawnPositionPacket";
import { activeConnections } from "../mainPacketHandler";
import { PacketHandler } from "../packetHander";
import ServerConfig from "../../../config.json"
import { CONSTANT } from "../../constants";
import { InLoginStartPacket } from "../../packet/impl/in/InLoginStartPacket";
import { OutEncryptionRequestPacket } from "../../packet/impl/out/OutEncryptionRequestPacket";
import * as crypto from "crypto"
import { InEncryptionResponsePacket } from "../../packet/impl/in/InEncryptionResponsePacket";
import { ChatMessage } from "../../net/chat";
import { dashUUID } from "../../utils/uuidUtils";
import axios from "axios";
import { hexDigest } from "../../utils/encryptionUtils";

export const LoginPacketHandler: PacketHandler = [
  {
    packet: InServerHandshakePacket,
    async handle(connection, packet: InServerHandshakePacket) {
      if (packet.nextState == 1) {
        connection.setState(ConnectionState.Status)
        connection.sendPacket(new OutServerListPingPacket({
          version: { name: ServerConfig.ping_info.version_name, protocol: CONSTANT.PROTOCOL.VERSION },
          players: { online: 1, max: ServerConfig.max_players, sample: [] },
          description: { text: ServerConfig.ping_info.description }
        }))
      }
  
      if (packet.nextState == 2) {
        connection.setState(ConnectionState.Login)
      }
    }
  },

  {
    packet: InLoginStartPacket,
    async handle(connection, packet: InLoginStartPacket) {
      const keys = crypto.generateKeyPairSync("rsa", {
        modulusLength: 1024
      })
      connection.keys = keys
      connection.player.info.username = packet.name
  
      connection.sendPacket(new OutEncryptionRequestPacket(keys.publicKey, connection.verifyToken))
    }
  },

  {
    packet: InEncryptionResponsePacket,
    async handle(connection, packet: InEncryptionResponsePacket) {
      const decryptedSecrect = connection.decrypt(packet.sharedSecret)
      const decryptedToken = connection.decrypt(packet.verifyToken)
      connection.sharedSecret = decryptedSecrect
  
      if (!decryptedToken.equals(connection.verifyToken)) {
        connection.disconnect(new ChatMessage("Verify token encrypted incorrectly."))
        return
      }
  
      const hash = hexDigest(connection.player.info.username, connection)
  
      try {
        const response = await axios.get(ServerConfig.session_server + `/session/minecraft/hasJoined?username=${connection.player.info.username}&serverId=${hash}`)
        if (response.data == "") {
          connection.disconnect(new ChatMessage("Failed to authenticate your account with session server."))
          return
        }
        initPlayer(connection, dashUUID(response.data.id))
      } catch (e) {
        connection.setState(ConnectionState.Login)
        connection.disconnect(new ChatMessage("Failed to connect to session server."))
        return
      }
    }
  },
]

let globalEntityId = 0

export function initPlayer(connection: Connection, uuid: string) {
  connection.player.info.eid = globalEntityId++

  connection.player.info.uuid = uuid

  console.log(`(${connection.id}) Joined with uuid ${connection.player.info.uuid} and username ${connection.player.info.username}`)
  connection.sendPacket(new OutSetCompressionPacket(-1))

  connection.sendPacket(new OutLoginSuccessPacket(connection.player.info.uuid, connection.player.info.username)) 
  connection.setState(ConnectionState.Play)

  connection.sendPacket(new OutPlayJoinGamePacket(
    connection.player.info.eid,
    Gamemode.Creative,
    Dimension.Overworld,
    Difficulty.Easy,
    1,
    LevelType.Default,
    false
  ))

  connection.sendPacket(new OutServerDifficultyPacket(Difficulty.Easy))

  connection.sendPacket(new OutSpawnPositionPacket({ x: 0.5, y: 2, z: 0.5 }))
  connection.sendPacket(new OutPlayerPositionLookPacket({ x: 0.5, y: 2, z: 0.5, yaw: 0, pitch: 0, ground: false }))

  const chunk1 = new Chunk(0,0,Dimension.Overworld)
  for (let x = 0; x < 16; x++) {
    for (let z = 0; z < 16; z++) {
      chunk1.setBlock({x, y: 0, z}, { type: x+z, meta: 0 })
    }
  }
  connection.sendPacket(new OutMapChunkBulkPacket([chunk1]))
  
  activeConnections.add(connection)
}