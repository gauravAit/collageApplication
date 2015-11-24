var AssignmentApp = require('express')();
var Http = require('http').Server(AssignmentApp);
var Io = require('socket.io')(Http);
AssignmentApp.get('/',function(req,res){
	res.sendFile(__dirname + '/ChatAppp.html');
});
Io.on('connection',function(socket){
	console.log('A new user has got connected!!!');     //On new user connected display on console that new user has got connected
	socket.on('chat message',function(msg){
		//console.log('message:'+msg);
		Io.emit('chat message', msg);                   //On receiving an object(it contains sender's name and his message),broadcast it to all connected clients
	});
	socket.on('disconnect', function(){                 // whenever a client/user disconnects(refresh counts for disconnect followed by  connect again)
		console.log('Some user has disconnected');
	});
})
Http.listen(3000,function(){                            //Using port  3000 for running server
	console.log('I am listening on*:3000');
});