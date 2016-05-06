var express = require('express');
var sachinApp = express();
var Http = require('http').Server(sachinApp);
const path = require('path');
sachinApp.get('/',function(req,res){
	res.sendFile(path.join(__dirname, '/ChatAppp.html'));
});
sachinApp.use(express.static(path.join(__dirname, 'data')));
sachinApp.use(express.static(path.join(__dirname, 'lib')));


Http.listen(3000,function(){                            //Using port  3000 for running server
	console.log('open your browser with url localhost:3000');
});
