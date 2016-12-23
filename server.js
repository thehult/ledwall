var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
app.ledwall = {};

var server = require('http').createServer(app);
app.server = server;

var chokidar = require('chokidar');
var path = require('path');

var io = require('socket.io').listen(server);
app.io = io;

var cfg = require('./cfg.js');
app.ledwall.config = cfg;

var wall = require('./wall.js')();

// IMPORT PLUGINS
var plugins = require('./plugins')(wall, app);
app.ledwall.plugins = plugins;

// IMPORT SCRIPTS
var scripts = require('./scripts.js')(wall.public, app);
scripts.watcher = chokidar.watch(__dirname + '/scripts', {
    ignored: /[\/\\]\./,
    persistent: true,
    awaitWriteFinish: true
});
scripts.watcher.on('add', scripts.add);
scripts.watcher.on('change', scripts.change);
scripts.watcher.on('unlink', scripts.remove);
app.ledwall.scripts = scripts;

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/static'));




app.get('/', function(req, res) {
    res.render('controller', scripts);
});

app.get('/admin', function(req, res) {
    res.render('controller', scripts, function(err, controllerhtml) {
        res.render('wallview', {}, function(err2, wallviewhtml) {
            res.render('admin', {controller: controllerhtml, wallview: wallviewhtml});
        });
    });
});

io.on('connection', function(socket) {
    socket.on('MoveScript', function(data, callback) {
        callback(scripts.setIndex(data.script, data.index));
    });

    socket.on('SetScriptActive', function(data, callback) {
        callback(scripts.setActive(data.script, data.active));
    });
});


server.listen(cfg.port, function() {
    console.log('Server started on port ' + cfg.port);
});

var tickTimer = setInterval(function() {
    wall.tick();
    scripts.tick();
}, 1000.0 / cfg.updatesPerSecond);
