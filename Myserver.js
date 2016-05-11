var express = require('express');
var collageApp = express();
var Http = require('http').Server(collageApp);
const path = require('path');
const ejs = require('ejs');

// res.render(path.join(__dirname, './collage.ejs'), {
// 	savedImages : ["test1.jpg","test2.jpg","test3.jpeg","test4.jpeg","test5.jpeg",]
// });

collageApp.get('/',function(req,res){
	res.render(path.join(__dirname, './collage.ejs'), {
		savedImages : ["test1.jpg","test2.jpg","test3.jpeg","test4.jpeg","test5.jpeg",]
	});
});
collageApp.use(express.static(path.join(__dirname, 'data')));
collageApp.use(express.static(path.join(__dirname, 'lib')));


Http.listen(3000,function(){                            //Using port  3000 for running server
	console.log('open your browser with url localhost:3000');
});
