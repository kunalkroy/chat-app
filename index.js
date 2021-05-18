const express = require('express');
const app = express();
const path = require('path');
const Filter = require('bad-words')
let filter = new Filter()
const port = process.env.PORT || 3000
const {generateTime, generateTimeURL} = require('./public/utils/time')
const http = require('http');
//we need to do this refactoring to include both express and socket.io in our node code
const server = http.createServer(app)
//creating an instance of socketIO
const socketIo = require('socket.io');
const { callbackify } = require('util');
// starting socket on server
const io = socketIo(server);
const {getUsersList,removeUser,addUser,getuserInfo} = require('./public/utils/user')

app.use(express.static(path.join(__dirname, './public')))
let message = "Welcome";
io.on('connection', (socket)=>{
    console.log('connection established')
    socket.on('join', (queryString, callback)=>{
        const error = addUser(socket.id, queryString.username, queryString.room)
        if(error){
            return callback(error)
        }
        let user = getuserInfo(socket.id)
        if(user){
            socket.join(queryString.room)
            socket.emit('display', generateTime(message, {username:'Admin'}))
            socket.broadcast.to(queryString.room).emit('display', generateTime(user.username + ' has joined the room', {username:'Admin'}))
        }
        io.to(user.room).emit('roomData', {
            room: user.room,
            usersList: getUsersList(user.room)
        })
        callback()
        
    })
    // socket.emit('display', generateTime(message))
    // socket.broadcast.emit('display', 'A new user has joined the room!')
    socket.on('show',(val,callback)=>{
        if(filter.isProfane(val)){
            // socket.emit('display', 'Use of foul lang!')
            callback('Profane language not allowed')
            return
        }
        let user = getuserInfo(socket.id)
        if(user){
            io.to(user.room).emit('display', generateTime(val, user))
            callback()
        }
        // we could have also used socket.emit if we wanted to send the event to client who fired it
        
    })
    socket.on('sendLocation', (position,callback) => {
        console.log(position)
        let user = getuserInfo(socket.id)
        if(user){
            io.to(user.room).emit('displayURL', generateTimeURL(`https://www.google.com/maps?q=${position.latitude},${position.longitude}`,user))
            callback()
        }
        
    })
    socket.on('disconnect', (reason)=>{
        let user = getuserInfo(socket.id)
        if(user){
            let temp = removeUser(user.id)
            temp.username = 'Admin'
            io.to(user.room).emit('display', generateTime(user.username+' has left the room!',temp))
            io.to(user.room).emit('roomData', {
                room: user.room,
                usersList: getUsersList(user.room)
            })
        }
        
    })
})


// app.set('view', path.join(__dirname, ))
app.set('view engine', 'hbs')

// app.get('/', (req,res)=>{

// })

server.listen(port, ()=>{
    // console.log(error)
    console.log('started')
});