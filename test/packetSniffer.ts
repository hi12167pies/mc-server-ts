import net from "net"

const server = net.createServer()

server.on("connection", socket => {
  socket.on("error", () => {})

  const connection = net.createConnection({
    host: "localhost",
    port: 25566
  })

  socket.on("data", data => {
    connection.write(data)
  })


  connection.on("data", data => {
    process.stdout.write(data)
    socket.write(data)
  })
})

server.listen(4000)