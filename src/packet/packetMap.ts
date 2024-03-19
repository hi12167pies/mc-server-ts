import { ConnectionState } from "../enum/ConnectionState";
import { InServerHandshakePacket } from "./impl/in/InHandeshakePacket";
import { InLoginStartPacket } from "./impl/in/InLoginStartPacket";
import { InPingPacket } from "./impl/in/InPingPacket";
import { InClientSettingsPacket } from "./impl/in/play/InClientSettingsPacket";
import { InPlayerPositionPacket } from "./impl/in/play/InPlayerPositionPacket";
import { InPluginMessagePacket } from "./impl/in/play/InPluginMessagePacket";
import { InPlayerPositionLookPacket } from "./impl/in/play/InPlayerPositionLookPacket";
import { Packet, PacketIn } from "./packet";
import { InKeepAlivePacket } from "./impl/in/play/InKeepAlivePacket";
import { InOnGroundPacket } from "./impl/in/play/InOnGroundPacket";
import { InPlayerLookPacket } from "./impl/in/play/InPlayerLookPacket";
import { InChatMessagePacket } from "./impl/in/play/InChatMessagePacket";
import { InEncryptionResponsePacket } from "./impl/in/InEncryptionResponsePacket";

export const packetMap: {
  [key: number]: { [key: number]: new () => PacketIn }
} = {
  [ConnectionState.Handshaking]: {
    [0x00]: InServerHandshakePacket
  },
  [ConnectionState.Login]: {
    [0x00]: InLoginStartPacket,
    [0x01]: InEncryptionResponsePacket
  },
  [ConnectionState.Status]: {
    [0x01]: InPingPacket
  },
  [ConnectionState.Play]: {
    [0x00]: InKeepAlivePacket,
    [0x01]: InChatMessagePacket,
    [0x03]: InOnGroundPacket,
    [0x04]: InPlayerPositionPacket,
    [0x05]: InPlayerLookPacket,
    [0x06]: InPlayerPositionLookPacket,
    [0x15]: InClientSettingsPacket,
    [0x17]: InPluginMessagePacket,
  }
}