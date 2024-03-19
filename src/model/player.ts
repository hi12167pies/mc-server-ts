import { Connection } from "../net/connection";
import { PlayerInfo } from "./playerInfo";
import { PlayerPosition } from "./position";

export class Player {
  public connection: Connection
  constructor (connection: Connection) {
    this.connection = connection
  }
  
  public info: PlayerInfo = { username: "", uuid: "", eid: -1 }
  public position: PlayerPosition = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0, ground: false }
}