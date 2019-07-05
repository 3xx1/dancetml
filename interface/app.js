// Dependencies
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http);

// Socket Connection
io.on('connection', function(socket) {
    console.log('[socket-server] A User Connected.');
    
    // receive data
    socket.on('data.update.interface', function(msg) {
        console.log(msg, 'msg');
        socket.broadcast.emit('data.update.extension', msg);
    });
})

// App Definition
app.use(express.static('public'))
app.use(express.static('node_modules/socket.io-client/dist/socket.io.js'))
app.listen(5050, function() {
    console.log('app is now listening on *:5050');
});
http.listen(5051, function() {
    console.log('[socket-server] Listening on *:5051');
});