
module.exports = function(board_cfg) {
    var Canvas = require('canvas');
    var Wall = {};

    Wall.config = board_cfg;

    Wall.width = 0;
    Wall.height = 0;
    Wall.listeners = [];

    Wall.registerListener = function(func) {
            Wall.listeners.push(func);
    };

    Wall.tick = function() {
        if(Wall.public.autoClear) {
            clear();
        }
        Wall.listeners.forEach(function(func) {
            func();
        });
    };

    Wall.clear = function(color) {
        var _color = color || {r: 0, g: 0, b: 0};
        for(var x = 0; x < Wall.width; x++) {
            for(var y = 0; y < Wall.height; y++) {
                Wall.wall[x][y] = _color;
            }
        }
    };

    Wall.public = {
        width: Wall.width,
        height: Wall.height,
        autoClear: false,
        autoClearColor: {r: 0, g: 0, b: 0},
        clear: Wall.clear,
        drawPixel: Wall.drawPixel
    };

    Wall.updateWallBounds = function() {
        Wall.width = 0;
        Wall.height  = 0;
        Wall.config.boards.forEach(function(board) {
            if(board[0] + board[2] > Wall.width ) {
                Wall.width  = board[0] + board[2];
            }
            if(board[1] + board[3] > Wall.height) {
                Wall.height = board[1] + board[3];
            }
        });

        Wall.Image = Canvas.Image;
        Wall.canvas = new Canvas(Wall.width, Wall.height);
        Wall.ctx = Wall.canvas.getContext('2d');
        Wall.ctx.fillStyle = "black";
        Wall.ctx.fillRect(0, 0, Wall.width, Wall.height);

        Wall.public.width = Wall.width;
        Wall.public.height = Wall.height;
    };

    Wall.updateWallBounds();


    Wall.getDataURL = function() {
        return Wall.canvas.toDataURL();
    }

    return Wall;
}
