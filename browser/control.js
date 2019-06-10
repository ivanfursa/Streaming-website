// Make connetion
var socket = io.connect("http://localhost:3000");

$(function () {
    // DOM elements
    var input = $("#url");
    var button = $("#buttonBlock");
    var video = $("#video");

    // If something is inputted, show the URL-request button
    input.on("input", function() {
        if (input.val() == "") {
            button.hide();
        } else {
            button.css("display", "flex");
        }
    });

    // Send "pause" and "play" events to browser
    video.on("play", function(){
        socket.emit('playVideo');
    });
    video.on("pause", function(){
        socket.emit('pauseVideo');
    });

    // Process the inputted video URL and send to server if valid
    button.click(function() {
        var url = String(input.val()).trim();
        if (url.indexOf("https://www.youtube.com/watch?v=") == 0) {
            url = url.replace("watch?v=", "embed/");
            video.css("visibility", "visible");
            input.attr("placeholder", "Paste a Youtube Link");

            // Send URL to the server
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    socket.emit("linkSent", url);   // Send URL for streaming
                }
            };
            request.open("GET", "http://localhost:3000/videoTest", true)    // Send URL for testing
            request.send()
        } else {
            input.attr("placeholder", "Wrong link");
        }
        // Clean-up
        input.val("");
        button.hide();
    });

    // Listening to users' actions
    socket.on("pauseVideo", function(){
        video.pause();
    });
    socket.on("playVideo", function(){
        video.play();
    });
});

