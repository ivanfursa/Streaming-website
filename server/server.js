// npm run dev - to run the code via nodemon

// Loading modules
const express = require('express')
const socket = require('socket.io')
const fs = require('fs')
const path = require('path')
const ytdl = require('ytdl-core')

// Instantiating Express JS
const app = express()

// Server setup
var server = app.listen(3000, function () {
  console.log('Listening on port 3000!')
})

// Send the HTML file to the root of the server
app.get('/', function(req, res) {
  res.sendFile('../browser/webLayout.html')
})

var videoURL = 'https://www.youtube.com/watch?v=r1d-t3EqbDk' // Default video
var fileSize

app.get('/videoTest', function (req, res) {
  // Load the video to learn its file size
  var test = ytdl(videoURL, { range: { start: 0, end: 600 } });
  var responded = false;
  test.on('progress', (n1, n2, size) => {
    if (!responded) {
      fileSize = size;
      res.send();
    }
    responded = true;
  })
})

app.get('/video', function (req, res) {
  const range = req.headers.range
  const parts = range.replace(/bytes=/, "").split("-")
  const start = parseInt(parts[0], 10)
  const end = fileSize - 1;

  const chunksize = end - start + 1;
  var file = ytdl(videoURL, {range: {start, end}})
  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
  }
    res.writeHead(206, head)
    file.pipe(res)
})

// Socket back-end setup
var io = socket(server);
io.on("connection", function(socket){
    socket.on('linkSent', function(url) {videoURL = url});
    socket.on('playVideo', function() {socket.broadcast.emit('playVideo')});
    socket.on('pauseVideo', function() {socket.broadcast.emit('pauseVideo')});
});