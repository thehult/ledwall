module.exports = function(wall, app) {
    var wallview = {};


    wallview.onWallChange = function() {
        app.io.emit('wallupdate', wall.wall);
    }

    app.get('/wallview', function(req, res) {
        res.render(require('path').join(__dirname, 'views/wallview'));
    });

    app.io.on('connection', function(socket) {
        socket.emit('initboards', wall.config.boards);
    });

    wall.registerListener(wallview.onWallChange);

    return wallview;
};
