$(document).ready(function(){
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
		var fakeEmail = 'YourEmail@email.com';

		usernameText = $('#username').val() ? $('#username').val() : 'Anonymous';

		$.modal.close();
		avatarSrc = 'https://www.gravatar.com/avatar/' + md5(fakeEmail.toLowerCase());
		$('#message-box').focus();
		socket.emit('createUser', {
			'username': usernameText,
			'avatar': avatarSrc
		});
	};

	$('#username-btn').click(function(e){
		console.log('clicked');
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

		//console.log(usernameText);

		if (msg) socket.emit('message', msg, function(data) {
			console.log(data);
		});
	};

	socket.on('connect', function() {
		$('#message-btn').click(function(e) {
			e.preventDefault();
			sendMsg();
		});

		$('#message-btn').keydown(function(e) {
			var event = e ? e : window.event;

			if (event.keyCode == 13) {
				sendMsg();
			}
		});

		socket.on('message', function(msg) {
			var container = $('<div></div>').attr('id', 'container');
			var bubble = $('<div></div>').addClass('talk-bubble tri-right left-in border');
			var textWrapper = $('<div></div>').addClass('talktext').appendTo(bubble);
			$('<p></p>').html(msg.msg).appendTo(textWrapper);

			// append the jquery clone to target destination.
			var nameClone = username2jqy(msg.username);
			var avaClone = avatar2jqy(msg.avatar);

			avaClone.appendTo(container);
			nameClone.appendTo(container);
			bubble.clone().appendTo(container);
			container.clone().appendTo($('#messages'));

			$('<br>').appendTo($('#messages'));

			// self-adjust scrolling height.
			var msgWrapper = document.getElementById('messages');
			msgWrapper.scrollTop = msgWrapper.scrollHeight;
		});

		socket.on('newUser', function(msg){
			$('#greeting').empty();
			$('<div></div>').addClass('headline').text(msg.greeting).appendTo($('#greeting'));
		});

		socket.on('userlist', function(userlist){
			$('#userlist').empty();
			$('<h2></h2>').text('Online users:').appendTo($('#userlist'));
			Object.keys(userlist).map(function(d){
				console.log(userlist[d]);
				var usrImg = $('<img></img>').attr('src', userlist[d].avatar);
				var usrName = $('<div></div>').text(userlist[d].username).addClass('listname');
				var profileWrapper = $('<div></div>').addClass('userlistProfile');
				usrImg.appendTo(profileWrapper);
				usrName.appendTo(profileWrapper);
				profileWrapper.appendTo($('#userlist'));
			});
		});
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