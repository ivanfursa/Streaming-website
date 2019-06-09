// Make connetion
var socket = io.connect("http://localhost:3000");

$(function () {
    // If something is inputted, show button
    var input = $("#url");  //if by tag name - don't add hashtag
    var button = $("#buttonBlock");
    var video = $("#video");

    input.on("input", function() {
        if (input.val() == "") {
            button.hide();
        } else {
            button.css("display", "flex");
        }
    });

    video.on("play", function(){
        socket.emit('playVideo');
    });
    video.on("pause", function(){
        socket.emit('pauseVideo');
    });

    button.click(function() {
        var url = String(input.val()).trim();
        if (url.indexOf("https://www.youtube.com/watch?v=") == 0) {
            url = url.replace("watch?v=", "embed/");
            video.css("visibility", "visible");
            video.attr("src", url);
            input.attr("placeholder", "Paste a Youtube Link");
        } else {
            input.attr("placeholder", "Wrong link");
        }
        input.val("");
        button.hide();
        socket.emit('linkSent', url);
    });

    // Listening to events
    socket.on('pauseVideo', function(){
        video.pause();
    });

    socket.on('playVideo', function(){
        video.play();
    });
});

