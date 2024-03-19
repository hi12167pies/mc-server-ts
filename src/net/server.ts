import net from "net"
import { Connection } from "./connection"
import { activeConnections } from "../handler/mainPacketHandler"

export class ProtocolServer {
  public server = net.createServer()

  public listen(port: number, callback: any) {
    this.server.listen(port, callback)
    this.server.on("connection", socket => {
      const connection = new Connection(socket)
      
      socket.on("error", (err: any) => {
        if (err.code == "ECONNRESET" || err.code == "ECONNABORTED") return
        console.log("Socket Error", err)
      })

      socket.on("end", () => {
        activeConnections.delete(connection)
      })

      this.connectionListeners.forEach(listener => {
        listener(connection)
      })
    })
  }

  private connectionListeners: any[] = []
  public onConnection(callback: (connection: Connection) => void) {
    this.connectionListeners.push(callback)
  }
}