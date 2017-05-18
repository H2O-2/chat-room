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

var addNewUser = function(socket, name) {
  console.log(socket.id);
  var personStr = sockets.length == 1 ? 'person' : 'people';
  socket.emit('newUser', {
    greeting: name + " joined the chat! " + sockets.length + ' ' + personStr + " online now!"
  });
};

io.on('connection', function(socket) {
  sockets.push(socket);

  socket.on('createUser', function(usr) {
    for(var j=0; j < sockets.length; j++){
      addNewUser(sockets[j], usr.username);
    }
  });

  socket.on('message', function(message) {
    var userChanged = false;

    if (!ID2user[socket.id]) {
      var newUser = {
        'username': message.username,
        'avatar': message.avatar
      };

      console.log('newwwww');

      userChanged = true;
      ID2user[socket.id] = newUser;
    }

    console.log(ID2user[socket.id]);

    if (userChanged) console.log(ID2user[socket.id].username + '(id: ' + socket.id + ' )' + 'joins!');

    for (var i = 0; i < sockets.length; i++) {
      sockets[i].emit('message', message);

      if (userChanged) {
        
        socket.emit('userlist', ID2user);
        //addNewUser(sockets[i]);
      }
    }
  });

  socket.on('disconnect', function() {
    var usernameOut = ID2user[socket.id].username;

    for(var i=0; i<sockets.length; i++){
      if(sockets[i].id === socket.id){
        sockets.splice(i, 1);
      }
    }

    delete ID2user[socket.id]; // remove user from online users.
    // send to client an updated userlist.
    for(var j=0; j < sockets.length; j++){
      console.log(usernameOut + '(id: ' + socket.id + ' )' + 'leaves...');
      sockets[j].emit('userlist', ID2user);
      //addNewUser(sockets[j]);
    }
    console.log("There are " + sockets.length + " active sockets remaining.");
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