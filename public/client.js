// obtain username from user.
$('#username-form').modal();
$('#username').focus();

// these are Jquery elements.
var usernameText;
var avatarSrc;

var username2jqy = function(usrString){
	var username = $('<div></div>').addClass('username');
	$('<span></span>').text(usrString).appendTo(username);
	return username;
};

var avatar2jqy = function(avaString){
	return $('<img></img>').attr('src', avaString);
};

var setNameNAvatar = function(){
	usernameText = $('#username').val() ? $('#username').val() : 'Anonymous';
	$.modal.close();
	avatarSrc = 'http://api.adorable.io/avatar/80/' + usernameText;
	$('#message-box').focus();
};

$('#username-btn').click(function(e){
	setNameNAvatar();
});

$('#username-form').keydown(function(e){
	if(!e){
		e = window.event;
	}
	if(e.keyCode == 13){
		setNameNAvatar();
	}
});
	

var socket = io();

// send new message & clear input
var sendMsg = function() {
	var msgText = $('#message-box').val();

	if (msgText.length === 0) return;

	var msg = {
		'username': usernameText,
		'avatar': avatarSrc,
		'msg': msgText
	};

	if (msg) socket.emit('message', msg, function(data) {
		console.log(data);
	});
};

socket.on('connect', function() {
	$('#message-btn').click(function(e) {
		e.preventDefault();
		sendMsg();
	});
});



/*
socket.on('greeting-from-server', function(message, fn) {
	console.log(message.greeting);
	fn('server da yo');
});

socket.emit('greeting-from-client', 'client bulabula', function(message) {
	console.log('from client: ', message);
});
*/