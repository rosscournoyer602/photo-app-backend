import { Server, Socket } from 'socket.io'
import * as http from 'http'

let connection: SocketIO

class SocketIO {
  constructor() {
    this.socket
  }

  private socket: Socket | undefined

  connect(http: http.Server) {
    const io = new Server(http, {
      cors: {
        origin: '*',
        // credentials: true
      }
    })

    io.on('connection', (socket: Socket) => {
      this.socket = socket
      this.socket.on('message', (message: string) => {
        console.log(message)
      })
    })
  }

  emitEvent(event: string, data: string) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  registerEvent(event: string, handler: any) {
    if (this.socket) {
      this.socket.on(event, handler)
    }
  }

  static init(server: http.Server) {
    if (!connection) {
      connection = new SocketIO()
      connection.connect(server)
    }
  }

  static getConnection(): SocketIO {
    if (!connection) {
      throw new Error("no active connection");
    }
    return connection
  }

}

module.exports = {
  connect: SocketIO.init,
  connection: SocketIO.getConnection
}