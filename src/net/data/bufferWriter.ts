import { CONSTANT } from "../../constants"
import { Position } from "../../model/position"
import { ChatMessage } from "../chat"
import { Connection } from "../connection"

export interface BufferWritable {
  writeByte(value: number): void
}

function isBufferWritable(object: any): object is BufferWritable {
  return 'writeByte' in object
}

export class ArrayBufferWriter implements BufferWritable {
  public data: number[] = []
  writeByte(value: number): void {
    this.data.push(value)
  }
  public getBuffer() {
    const buffer = Buffer.alloc(this.data.length)
    for (let i = 0; i < this.data.length; i++) {
      buffer[i] = this.data[i]
    }
    return buffer
  }
}

export class BufferWriter {
  private input?: BufferWritable
  constructor(input: BufferWritable) {
    this.input = input
  }

  public async writeUnsignedByte(value: number) {
    if (isBufferWritable(this.input)) {
      this.input.writeByte(value)
      return
    }
    throw new Error("Failed to write to buffer")
  }

  public async writeSignedNumber(value: number, length: number) {
    let arr = new Array(length);
    const signBitMask = 0x80 // Mask for the sign bit (MSB)
  
    // Check if the value is negative
    const isNegative = value < 0;
  
    for (let i = 0; i < length; i++) {
      if (isNegative) {
        // For negative numbers, set all bits to 1 initially
        arr[i] = 0xFF
      } else {
        // For positive numbers, set all bits to 0 initially
        arr[i] = 0x00
      }
    }
  
    // Write the absolute value of the number into the array
    let absoluteValue = Math.abs(value)
    for (let i = length - 1; i >= 0; i--) {
      arr[i] = absoluteValue & 0xFF; // Take the least significant byte
      absoluteValue >>= 8 // Shift right by 8 bits
    }
  
    // Set the sign bit if the value is negative
    if (isNegative) {
      arr[0] |= signBitMask
    }
  
    this.writeUnsignedByteArray(arr)
  }
  
  public async writeUnsignedNumber(value: number, length: number) {
    let arr = new Array(length)
  
    for (let i = length - 1; i >= 0; i--) {
      arr[i] = value & 0xFF // Take the least significant byte
      value >>= 8 // Shift right by 8 bits
    }
  
    this.writeUnsignedByteArray(arr)
  }
  
  
  
  public getVarIntArray(value: number) {
    let data = []
    while (true) {
      if ((value & ~CONSTANT.DATA.SEGMENT_BITS) == 0) {
        data.push(value)
        break
      }

      data.push((value & CONSTANT.DATA.SEGMENT_BITS) | CONSTANT.DATA.CONTINUE_BIT)

      value >>>= 7
    }
    return data
  }

  public writeVarInt(value: number) {
    let data = this.getVarIntArray(value)
    for (let i = 0; i < data.length; i++) {
      this.writeUnsignedByte(data[i])
    }
  }

  public writeUnsignedShort(value: number) {
    this.writeUnsignedNumber(value, 2)
  }

  public writeVarLong(value: number) {
    this.writeVarInt(value)
  }
  
  public writeString(data: string) {
    this.writeVarInt(data.length)
    data.split("").forEach(charString => {
      const char = charString.charCodeAt(0)
      this.writeUnsignedByte(char)
    })
  }

  public writeJSON(json: any) {
    this.writeString(JSON.stringify(json))
  }

  public writeChat(chat: ChatMessage) {
    this.writeJSON(chat.toJSON())
  }

  public writeLong(value: number) {
    this.writeSignedNumber(value, 8)
  }

  public writeInt(value: number) {
    this.writeSignedNumber(value, 4)
  }

  public writeByte(value: number) {
    this.writeUnsignedByte(value < 0 ? 256 + value : value)
  }

  public writeBoolean(value: boolean) {
    this.writeUnsignedByte(value ? 0x1 : 0x0)
  }

  public writeBuffer(buffer: Buffer) {
    for (let i = 0; i < buffer.byteLength; i++) {
      this.writeUnsignedByte(buffer[i])
    }
  }

  public writeUnsignedByteArray(bytes: number[]) {
    for (let i = 0; i < bytes.length; i++) {
      this.writeUnsignedByte(bytes[i])
    }
  }

  public writePosition(position: Position) {
    const value = ((position.x & 0x3FFFFFF) << 38) | ((position.z & 0x3FFFFFF) << 12) | (position.z & 0xFFF)

    const bytes: number[] = []
    for (let i = 0; i < 8; i++) {
      bytes.push((value >> (i * 8)) & 0xff)
    }
    
    this.writeUnsignedByteArray(bytes)
  }

  public writeFloat(value: number) {
    const floatArray = new Float32Array(1)
    floatArray[0] = value
    const byteArray = new Uint8Array(floatArray.buffer)
    for (let i = 0; i < byteArray.length; i++) {
      this.writeUnsignedByte(byteArray[i])
    }
  }

  public writeDouble(value: number) {
    const doubleArray = new Float64Array(1)
    doubleArray[0] = value
    const byteArray = new Uint8Array(doubleArray.buffer)
    for (let i = 0; i < byteArray.length; i++) {
      this.writeUnsignedByte(byteArray[i])
    }
  }
}