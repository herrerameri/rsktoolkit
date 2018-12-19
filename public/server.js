var http = require("http");
var path = require("path");
var fs = require("fs");
var CONFIG = require('./config.json');

var checkMimeType = true;
var port = CONFIG.SITE.port;
var serverUrl = CONFIG.SITE.serverUrl;

var indexPage = "/index.html";

console.log("Starting web server at http://" + serverUrl + ":" + port);

http.createServer(function(req, res) {
  loadServerConfiguration(req, res);
}).listen(port, serverUrl);


function getFile(localPath, res, mimeType) {
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}

function loadServerConfiguration(req, res){
	var filename = req.url == "/" ?  indexPage : req.url;	
	var ext = path.extname(filename);
	var localPath = __dirname;
	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".json": "application/json",
		".pdf": "application/pdf",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".svg": "image/svg+xml",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	var validMimeType = true;
	var mimeType = validExtensions[ext];
	if (checkMimeType) {
		validMimeType = validExtensions[ext] != undefined;
	}

	if (validMimeType) {
		localPath += filename;
		fs.exists(localPath, function(exists) {
			if(exists) {
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				res.writeHead(404);
				res.end();
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
	};
}