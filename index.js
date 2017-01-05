var update = require("./updater.js");

var timer = setInterval(function() {
    if(update.finished) {
        clearInterval(timer);
        var app = require("./server.js");
    }
}, 250);
