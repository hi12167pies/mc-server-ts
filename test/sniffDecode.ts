import { readFileSync } from "fs";
import { BufferReader } from "../src/net/data/bufferReader";

async function main() {
  const buffer = readFileSync("sniff.txt")

  let data: number[] = []
  buffer.forEach(char => data.push(char))

  const bufferReader = new BufferReader(data)

  while (bufferReader.getDataAvailable() > 0) {

    const length = await bufferReader.readVarInt()
    const id = await bufferReader.readVarIntWithMetadata()
    const data = await bufferReader.readUnsignedBytes(length - id.bytesRead)
    

    if (true) {
      process.stdout.write(`0x${id.value.toString(16).padStart(2, "0")} `)
      data.forEach((value, i) => {
        if (i % 10 == 0 && i != 0) {
          process.stdout.write("\n" + " ".repeat(5))
        }
        process.stdout.write("0x" + value.toString(16).padStart(2, "0"))
        process.stdout.write(" ")
      })
  
      process.stdout.write("\n")
    }

  }
}

main()