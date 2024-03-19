import net from "net"
import { PacketIn, PacketOut } from "../packet/packet"
import { ConnectionState } from "../enum/ConnectionState"
import { BufferReadable, BufferReader } from "./data/bufferReader"
import { BufferWritable, BufferWriter } from "./data/bufferWriter"
import { PacketWriter } from "./data/packetWriter"
import { PacketReader } from "./data/packetReader"
import { Player } from "../model/player"
import * as crypto from "crypto"
import { ChatMessage } from "./chat"
import { OutLoginDisconnectPacket } from "../packet/impl/out/OutLoginDisconnectPacket"

let connectionGlobalId: number = 0

export class Connection implements BufferReadable, BufferWritable {
  public socket: net.Socket
  private dataBuffer: number[] = []
  private byteListeners: Set<any> = new Set()
  public state: number = 0
  public id: number = connectionGlobalId++
  public player: Player = new Player(this)

  public constructor(socket: net.Socket) {
    this.socket = socket
    if (socket == null) return

    this.socket.on("data", data => {
      for (let i = 0; i < data.byteLength; i++) {
        this.dataBuffer.push(data.readUint8(i))
      }
      // Call events
      this.byteListeners.forEach(listener => {
        listener()
        // Delete from array since listeners are only needed once
        this.byteListeners.delete(listener)
      })
    })
  }

  public setState(state: ConnectionState) {
    this.state = state
  }

  /**
   * This contains the basic code for reading bytes
   */

  private readByteFromBuffer(): number {
    let byte = this.dataBuffer[0]
    this.dataBuffer = this.dataBuffer.slice(1)
    if (this.isEncryption()) {
      byte = this.cipherDecrypt(Buffer.from([byte]))[0]
    }
    return byte
  }

  public readByte(): Promise<number> {
    return new Promise((resolve, reject) => {
      // If there is data in the buffer we can read it
      if (this.dataBuffer.length > 0) {
        resolve(this.readByteFromBuffer())
        return
      }
      // If there is nothing we will wait unitl there is data
      this.byteListeners.add(() => {
        resolve(this.readByteFromBuffer())
      })
    })
  }

  /**
   * This contains the basic code for writing bytes
   */

  private writeBuffer: number[] = []
  public writeByte(byte: number) {
    this.writeBuffer.push(byte)
  }

  /**
   * Flush will write all the data in the current buffer to the socket
   */

  public flush() {
    let buffer = Buffer.from(this.writeBuffer)
    if (this.isEncryption()) {
      buffer = this.cipherEncrypt(buffer)
    }
    this.socket.write(buffer)
    this.writeBuffer = []
  }

  /**
   * These are used to write and read data from the socket
   */
  public reader: BufferReader = new BufferReader(this)
  public writer: BufferWriter = new BufferWriter(this)

  /**
   * This section contains the code for the packet system
   */

  public packetWriter: PacketWriter = new PacketWriter(this, this.writer)
  public packetReader: PacketReader = new PacketReader(this, this.reader)

  /**
   * Packet reading
   */
  public readPacket(): Promise<PacketIn | null> {
    return this.packetReader.readUncompressedPacket()
  }

  /**
   * Packet sending and writing
   */
  public writePacket(packet: PacketOut) {
    this.packetWriter.writeUncompressedPacket(packet)
  }
  
  public sendPacket(packet: PacketOut) {
    if (packet.getState() != this.state) {
      throw new Error("Attempted to send packet while in incorrect state.")
    }
    this.writePacket(packet)
    this.flush()
  }

  // encrpytion
  public keys?: crypto.KeyPairKeyObjectResult
  public sharedSecret?: Buffer
  public cipher?: crypto.Cipher
  public decipher?: crypto.Cipher
  public verifyToken = crypto.randomBytes(32)

  public isEncryption(): this is { keys: crypto.KeyPairKeyObjectResult, sharedSecret: Buffer } {
    return this.keys != undefined && this.sharedSecret != undefined
  }

  public decrypt(buffer: Buffer): Buffer {
    if (this.keys == undefined) throw new Error("Keys are undefined")
    return crypto.privateDecrypt({
      key: this.keys.privateKey,
      padding: 1
    }, buffer)
  }

  public cipherEncrypt(buffer: Buffer): Buffer {
    if (!this.isEncryption()) throw new Error("Encryption not enabled")
    if (!this.cipher) {
      this.cipher = crypto.createCipheriv("aes-128-cfb8", this.sharedSecret, this.sharedSecret)
    }
    return this.cipher.update(buffer)
  }

  public cipherDecrypt(buffer: Buffer): Buffer {
    if (!this.isEncryption()) throw new Error("Encryption not enabled")
  
    if (!this.decipher) {
      this.decipher = crypto.createDecipheriv("aes-128-cfb8", this.sharedSecret, this.sharedSecret);
    }

    return this.decipher.update(buffer)
  }

  // kick
  public disconnect(reason: ChatMessage) {
    switch (this.state) {
      case ConnectionState.Login:
        this.sendPacket(new OutLoginDisconnectPacket(reason))
        this.socket.destroy()
        break
      default:
        throw new Error("Cannot disconnect in state " + this.state)
    }
  }
}