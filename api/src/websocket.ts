import http from 'http'
import socketio from 'socket.io'

interface StateType {
  io: socketio.Server | null
  users: any[]
}

const state: StateType = {
  io: null,
  users: [],
}

function init(server: http.Server): void {
  const io = new socketio.Server(server)

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('login', (user) => {
      console.log('login', user)
      state.users.push({ ...user, socketId: socket.id })
    })

    socket.on('logout', (user) => {
      console.log('logout', user)
      state.users = state.users.filter((u: any) => u.socketId !== socket.id)
    })

    socket.on('disconnect', () => {
      state.users = state.users.filter(
        (user: any) => user.socketId !== socket.id
      )
      console.log('user disconnected')
    })
  })

  state.io = io
}

function getIO(): socketio.Server {
  return state.io as socketio.Server
}

function getUsers(): any[] {
  return state.users
}

// emit to user on pb returned
function emitToUser(userId: string, event: string, data: any): void {
  const user = state.users.filter((user: any) => user.id === userId)
  if (user.length > 0) {
    user.forEach((u: any) => {
      ;(state.io as socketio.Server).to(u.socketId).emit(event, data)
    })
  } else {
    console.log('user not found', { userId, event, data })
  }
}

export default { init, getIO, getUsers, emitToUser }
