import { CONSTANT } from "../../constants"
import { Connection } from "../connection"
import * as crpyto from "crypto"

export interface BufferReadable {
  readByte(): Promise<number>
}

function isBufferReadable(object: any): object is BufferReadable {
  return 'writeByte' in object
}

export class BufferReader {
  private input?: BufferReadable | number[]
  constructor(input: BufferReadable | number[]) {
    this.input = input
  }

  private keys: crpyto.KeyPairKeyObjectResult | null = null
  public setEncrpytionKeys(keys: crpyto.KeyPairKeyObjectResult) {
    this.keys = keys
  }

  public getDataAvailable(): number {
    if (this.input instanceof Array) {
      return this.input.length
    }
    return 0
  }

  public async readDouble(): Promise<number> {
    const buffer = Buffer.from(await this.readUnsignedBytes(8))
    return buffer.readDoubleBE()
  }

  public async readFloat(): Promise<number> {
    const buffer = Buffer.from(await this.readUnsignedBytes(4))
    return buffer.readFloatBE()
  }

  public async readBoolean(): Promise<boolean> {
    return (await this.readUnsignedByte()) == 0x1
  }


  public async readUnsignedByte(): Promise<number> {
    if (isBufferReadable(this.input)) {
      const data = await this.input.readByte()
      return data
    }
    if (this.input instanceof Array) {
      const array = this.input as number[]
      return new Promise((resolve,reject) => {
        const data = array.shift()
        if (data == null) throw new Error("Attempted to read more data than available")
        resolve(data)
      })
    }
    throw new Error("Failed to read from buffer")
  }
  
  public async readByte(): Promise<number> {
    const unsignedByte = await this.readUnsignedByte()
    return (unsignedByte > 127) ? unsignedByte - 256 : unsignedByte
  }

  public async readUnsignedBytes(length: number) {
    let bytes = []
    for (let i = 0; i < length; i++) {
      const byte = await this.readUnsignedByte()
      bytes.push(byte)
    }
    return bytes
  }

  public async readSignedNumber(length: number): Promise<number> {
    let result = 0

    for (let i = 0; i < length; i++) {
      const byte = await this.readUnsignedByte()

      if (byte & 0x80) {
        result = (result << 8) | (~byte + 1)
      } else {
        result = (result << 8) | byte;
      }
    }

    return result
  }

  public async readUnsignedNumber(length: number): Promise<number> {
    let result = 0

    for (let i = 0; i < length; i++) {
      const byte = await this.readUnsignedByte()
      result = (result << 8) | byte
    }

    return result
  }

  public async readVarIntWithMetadata(): Promise<{value: number, bytesRead: number}> {
    let value: number = 0
    let position: number = 0
    let currentByte: number
    let bytesRead: number = 0

    while (true) {
      currentByte = await this.readUnsignedByte()
      bytesRead++
      value |= (currentByte & CONSTANT.DATA.SEGMENT_BITS) << position

      if ((currentByte & CONSTANT.DATA.CONTINUE_BIT) === 0) break

      position += 7;

      if (position >= 32) throw new Error("VarInt is too big")
    }

    return { value, bytesRead }
  }

  public async readVarInt(): Promise<number> {
    return (await this.readVarIntWithMetadata()).value
  }

  public async readVarLong(): Promise<number> {
    let value: number = 0
    let position: number = 0
    let currentByte: number

    while (true) {
      currentByte = await this.readUnsignedByte()
      value |= (currentByte & CONSTANT.DATA.SEGMENT_BITS) << position;

      if ((currentByte & CONSTANT.DATA.CONTINUE_BIT) == 0) break;

      position += 7;

      if (position >= 64) throw new Error("VarLong is too big");
    }

    return value
  }

  public async readString(): Promise<string> {
    const length = await this.readVarInt()
    let string = ""
    for (let i = 0; i < length; i++) {
      string += String.fromCharCode(await this.readUnsignedByte())
    }
    return string
  }

  public async readUnsignedShort(): Promise<number> {
    return (await this.readUnsignedByte() << 8) | await this.readUnsignedByte()
  }
  
  public async readLong(): Promise<number> {
    return await this.readSignedNumber(8)
  }

  public async readJSON(): Promise<any> {
    const string = await this.readString()
    return JSON.parse(string)
  }
}