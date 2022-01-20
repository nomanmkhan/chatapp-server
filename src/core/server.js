require("../config/db");
const app = require("./app")
const socketio = require('socket.io');

const server = require('http').createServer(app);
server.listen(process.env.PORT || 80, () => {
    console.log("server is running on: ", process.env.PORT)

})

// const io = require('socket.io')(8900, {
//     cors: {
//         origin: "https://chatapp-server-nmk.herokuapp.com"
//         // origin: "http://172.16.2.109:3001"
//     }
// })
const io = socketio(server);

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push(({ userId, socketId }))
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}


const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log("someone connected")
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users)
    })

    // send and get msgs
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text
        })
    })
})