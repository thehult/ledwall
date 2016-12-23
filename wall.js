module.exports = function() {
    var Wall = {};

    Wall.config = {
        boards: [   [0,0,16,16],
                    [16,0,16,16],
                    [32,0,16,16],
                    [48,0,16,16]]
    };

    Wall.width = 0;
    Wall.height = 0;
    Wall.wall = [];
    Wall.listeners = [];

    Wall.drawPixel = function(x, y, color) {
        Wall.wall[x][y] = color;
    };

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
        Wall.wall = [];
        for(var x = 0; x < Wall.width; x++) {
            Wall.wall.push([]);
            for(var y = 0; y < Wall.height; y++) {
                Wall.wall[x].push({r: 0, g: 0, b: 0});
            }
        }
        Wall.public.width = Wall.width;
        Wall.public.height = Wall.height;
    };

    Wall.updateWallBounds();



    return Wall;
}
