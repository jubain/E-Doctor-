const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

let users = []
app.use(express.static(publicDirectoryPath))
console.log(users.length)
const addUser = (roomID, username) => {

    users.push({ roomID: roomID, username: username })

}

const getRoomUsers = (roomID) => {
    return users.filter(user => (user.roomID === roomID))
}

const userLeave = (username) => {
    users = users.filter(user => user.username !== username)
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection jubeen')
    socket.on('join-room', ({ roomID, username }) => {
        console.log(`${username} joined in room ${roomID}`)
        addUser(roomID, username)
        socket.to(roomID).emit('user-connected', username)

        io.emit('all-users', getRoomUsers(roomID))
        //io.to(roomID).emit("all-users", getRoomUsers(roomID))
        socket.on('disconnect', () => {
            console.log('disconnected')
            socket.leave(roomID)
            userLeave(username)
            io.emit("all-users", getRoomUsers(roomID))
        })
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})