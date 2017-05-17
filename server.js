// express's version of server.js
var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

server = http.Server(app);
server.listen(3000);
io = socketIO(server);

var sockets = [];
var ID2user = {};



io.on('connection', function(socket) {
  sockets.push(socket);

  var newUser = function(socket) {
    var personStr = sockets.length == 1 ? 'person' : 'people';
    socket.emit('newUser', {
      greeting: " joined the chat! " + sockets.length + ' ' + personStr + " online now!"
    });
  };

  newUser(socket);

  socket.on('message', function(message) {
    var userChanged = false;

    if (!ID2user[socket.id]) {
      var newUser = {
        'username': message.username,
        'avatar': message.avatarSrc
      };

      userChanged = true;
      ID2user[socket.id] = newUser;
    }

    for (var i = 0; i < sockets.length; i++) {
      sockets[i].emit('message', message);
      if (userChanged) {
        console.log(ID2user[socket.id].username + '(id: ' + socket.id + ' )' + 'joins!');
        socket.emit('userList', ID2user);
        newUser(sockets[i]);
      }
    }
  });
});



/*
io.on('connection', function (socket) {
  socket.emit('greeting-from-server', {
      greeting: 'Hello Client'
  }, function(data) {
    console.log('from server: ', data);
  });
  
  socket.on('greeting-from-client', function (message, fn) {
    console.log(message);
    fn('fvck');
  });
});
*/