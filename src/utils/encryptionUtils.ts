import * as crypto from "crypto"
import { Connection } from "../net/connection"

export function hexDigest(text: string, connection: Connection): string {
  if (!connection.isEncryption()) throw new Error("Encryption is not enabled")
  const hash = crypto.createHash("sha1")
    .update("")
    .update(connection.sharedSecret)
    .update(getKeyBytes(connection.keys.publicKey))
    .digest()
  
  let negative = hash.readInt8(0) < 0
  if (negative) performTwosCompliment(hash)
  let digest = hash.toString('hex')
  // trim leading zeroes
  digest = digest.replace(/^0+/g, '')
  if (negative) digest = '-' + digest
  return digest
}

function performTwosCompliment(buffer: Buffer) {
  let carry = true;
  let i, newByte, value;
  for (let i = buffer.length - 1; i >= 0; --i) {
    value = buffer.readUInt8(i)
    newByte = ~value & 0xff
    if (carry) {
      carry = newByte === 0xff
      buffer.writeUInt8(carry ? 0 : newByte + 1, i)
    } else {
      buffer.writeUInt8(newByte, i)
    }
  }
}

export function getKeyBytes(key: crypto.KeyObject): Buffer {
  const k = key.export({
    type: "spki",
    format: "pem",
  }).toString()

  const keyNoHeaders = k
    .replace('-----BEGIN PUBLIC KEY-----\n', '')
    .replace('\n-----END PUBLIC KEY-----\n', '');
    
  const keyBytes = Buffer.from(keyNoHeaders, "base64")
  return keyBytes
}