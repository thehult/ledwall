var express = require('express');
var exphbs = require('express-handlebars');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.ledwall = {};

var server = require('http').createServer(app);
app.server = server;

var chokidar = require('chokidar');
var path = require('path');

var fs = require('fs');
var fsextra = require('fs-extra');

var io = require('socket.io').listen(server);
app.io = io;

var cfg = require('./cfg.js');
app.ledwall.config = cfg;

var wall = require('./wall.js')(cfg.wall);

// IMPORT PLUGINS
var plugins = require('./plugins')(wall, app);
app.ledwall.plugins = plugins;

// IMPORT SCRIPTS
var scripts = require('./scripts')(wall.public, app);
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
    res.render('controller', {scripts: scripts.files, activated: scripts.activated});
});

app.get('/wall', function(req, res) {
    res.render('wall');
});

app.get('/editor', function(req, res) {
    res.render('editor', {});
});

app.get('/editor/:script', function(req, res) {
    console.log("GET SCRIPT: " + req.params.script);
    console.log(path.join(__dirname, 'scripts', req.params.script, 'index.js'));
    if(!fs.existsSync(path.join(__dirname, 'scripts', req.params.script, 'index.js'))) {
        res.redirect("/editor");
    } else {
        var fileCont = fs.readFileSync(path.join(__dirname, 'scripts', req.params.script, 'index.js'), {encoding: 'utf8'});

        var parametercode = fileCont.search("//SCRIPT_PARAMETERS\r\n") + 21;
        var parametercode_end = fileCont.search("//SCRIPT_PARAMETERS_END");
        var startcode = fileCont.search("//SCRIPT_START\r\n") + 16;
        var startcode_end = fileCont.search("//SCRIPT_START_END");
        var tickcode = fileCont.search("//SCRIPT_TICK\r\n") + 15;
        var tickcode_end = fileCont.search("//SCRIPT_TICK_END");
        var stopcode = fileCont.search("//SCRIPT_STOP\r\n") + 15;
        var stopcode_end = fileCont.search("//SCRIPT_STOP_END");

        var parameters = [];
        var par = fileCont.substring(parametercode, parametercode_end);
        var pars = par.trim().split("\r\n");
        for(var i = 0; i < pars.length; i++) {
            if(pars[i].startsWith("this")) {
                var parsp = pars[i].split(" = ");
                parameters.push({
                    name: parsp[0].replace("this.", ""),
                    value: parsp[1].replace(";", "")
                });
            }
        }

        var scrip = {
            edit: true,
            name: req.params.script,
            parameters: parameters,
            startcode: fileCont.substring(startcode, startcode_end),
            tickcode: fileCont.substring(tickcode, tickcode_end),
            stopcode: fileCont.substring(stopcode, stopcode_end)
        }

        res.render('editor', scrip);
    }
});

app.post('/edit', function(req, res) {
    console.log("EDIT " + req.body.name);
    console.log(path.join(__dirname, 'scripts', req.body.name, 'index.js'));
    if(!fs.existsSync(path.join(__dirname, 'scripts', req.body.name, 'index.js'))) {
        fsextra.copySync(path.join(__dirname, 'templates', 'Script'), path.join(__dirname, 'scripts', req.body.name));
    }
    var fileCont = fs.readFileSync(path.join(__dirname, 'scripts', req.body.name, 'index.js'), {encoding: 'utf8'});
    var parameters = "";
    var parameters_real = "this.parameters = {";
    if(typeof req.body['parameter[]'] !== 'undefined') {
        for(var i = 0; i < req.body['parameter[]'].length; i++) {
            if(req.body['parameter[]'][i].trim() != "") {
                if(req.body['parametervalue[]'][i].trim() != "") {
                    parameters_real += req.body['parameter[]'][i] + ": " + req.body['parametervalue[]'][i] + ", ";
                    parameters += "this." + req.body['parameter[]'][i] + " = " + req.body['parametervalue[]'][i] + ";\r\n";
                }
            }
        }
    }
    parameters = parameters_real.substring(parameters_real.length-2, parameters_real) + "};\r\n"+parameters;
    fileCont = fileCont.replace(
        /\/\/SCRIPT_PARAMETERS(.|\n|\r)*\/\/SCRIPT_PARAMETERS_END/gm,
        "//SCRIPT_PARAMETERS\r\n" + parameters + "\r\n//SCRIPT_PARAMETERS_END"
    );
    fileCont = fileCont.replace(
        /\/\/SCRIPT_START(.|\n|\r)*\/\/SCRIPT_START_END/gm,
        "//SCRIPT_START\r\n" + req.body.startcode + "\r\n//SCRIPT_START_END"
    );
    fileCont = fileCont.replace(
        /\/\/SCRIPT_TICK(.|\n|\r)*\/\/SCRIPT_TICK_END/gm,
        "//SCRIPT_TICK\r\n" + req.body.tickcode + "\r\n//SCRIPT_TICK_END"
    );
    fileCont = fileCont.replace(
        /\/\/SCRIPT_STOP(.|\n|\r)*\/\/SCRIPT_STOP_END/gm,
        "//SCRIPT_STOP\r\n" + req.body.stopcode + "\r\n//SCRIPT_STOP_END"
    );

    fs.writeFileSync(path.join(__dirname, 'scripts', req.body.name, 'index.js'), fileCont);
    res.send(req.body);
});

app.get('/admin', function(req, res) {
    res.render('controller', scripts, function(err, controllerhtml) {
        res.render('wallview', {}, function(err2, wallviewhtml) {
            res.render('admin', {controller: controllerhtml, wallview: wallviewhtml});
        });
    });
});

io.on('connection', function(socket) {
    socket.on('ScriptMove', function(data, callback) {
        scripts.scriptMove(data.oldIndex, data.newIndex);
    });

    socket.on('ScriptActivate', function(data, callback) {
        try {
            scripts.scriptActivate(data.id);
        } catch(e) {
            socket.emit("UtilLog", {str: e.toString()});
        }
    });

    socket.on('ScriptDeactivate', function(data, callback) {
        scripts.scriptDeactivate(data.index);
    });

    socket.on('ImageGetConfig', function() {
        socket.emit('ImageConfig', {
            width: wall.width,
            height: wall.height,
            boards: wall.config.boards
        });
    });

    socket.on("ScriptParameters", function(data, callback) {
        callback(scripts.getParameters(data.index));
    });
});


server.listen(cfg.port, function() {
    console.log('Server started on port ' + cfg.port);
});

var SPI = require('pi-spi');
app.spi = SPI.initialize("/dev/spidev0.0")

app.boardsBuffer = Buffer.alloc(768 * wall.config.boards.length);
app.gpio = require('rpi-gpio');

app.gpioReady = false;
app.gpio.setup(15, app.gpio.DIR_OUT, function(err) {
    if(err) console.log("GPIO SETUP FAILED!");
    app.gpioReady = true;
});

app.tickTimer = setInterval(function() {
    wall.tick();
    try {
        scripts.tick();
    } catch(e) {
        io.emit("UtilLog", {str: e.toString()});
    }
    var imgData = wall.ctx.getImageData(0, 0, wall.width, wall.height);
    var p = 0;
    for(var i = wall.config.boards.length - 1; i >= 0; i--) {
        for(var y = wall.config.boards[i][1]; y < wall.config.boards[i][3]; y++) {
            for(var x = wall.config.boards[i][0]; x < wall.config.boards[i][2]; x++) {
                var j = 4*(y*wall.width + x);
                p = app.boardsBuffer.writeInt8(imgData[j], p);
                p = app.boardsBuffer.writeInt8(imgData[j+1], p);
                p = app.boardsBuffer.writeInt8(imgData[j+2], p);
            }
        }
    }
    if(app.gpioReady) {
        app.gpio.write(15, false, function(err) {
            if(err) return console.log("FAILED LOWERING SS-PIN!");
            app.spi.write(app.boardsBuffer, function(err) {
                if(err) return console.log("FAILED WRITING BUFFER!");
                app.gpio.write(15, true, function(err) {
                    if(err) return console.log("FAILED RAISING SS-PIN!");
                    console.log("SENT VIA SPI SUCCESSFULLY ------------------");
                });
            });

        });
    }
    io.emit("ImageData", {data: imgData.data, length: imgData.data.length });
}, 1000.0 / cfg.updatesPerSecond);

module.exports = app;
