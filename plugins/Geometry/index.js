module.exports = function(wall, app) {
    var geometry = {};

    geometry.Point = function(x, y) {
        this.x = x;
        this.y = y;
        this.draw = function(color) {
            geometry.drawPoint(this.x, this.y, color);
        }
    };
    geometry.drawPoint = function(x, y, color) {
        wall.drawPixel(x, y, color);
    }

    geometry.Line = function(x1, y1, x2, y2) {
        if(x1 instanceof geometry.Point && y1 instanceof geometry.Point) {
            this.fromPoint = x1;
            this.toPoint = y1;
        } else if(typeof x1 === 'number' && typeof y1 === 'number' && typeof x2 === 'number' && typeof y2 === 'number') {
            this.fromPoint = new geometry.Point(x1, y1);
            this.toPoint = new geometry.Point(x2, y2);
        } else {
            return null;
        }
        this.draw = function(color) {

        };
    };

    var octant = function(dx, dy) {
        var octant = 0;
        if(dy < 0) {
            dx = -dx;
            dy = -dy;
            octant += 4;
        }
        if(dx < 0) {
            var _t = dx;
            dx = dy;
            dy = -_t;
            octant += 2;
        }
        if(dx < dy) {
            octant += 1;
        }
    }

    var octantInput = function(x, y) {
        switch(octant(x,y)) {
            case 0: return [x, y]; break;
            case 1: return [y, x]; break;
            case 2: return [y, -x]; break;
            case 3: return [-x, y]; break;
            case 4: return [-x, -y]; break;
            case 5: return [-y, -x]; break;
            case 6: return [-y, x]; break;
            case 7: return [x, -y]; break;
        }
    }

    var octantOutput = function(x, y) {
        switch(octant(x,y)) {
            case 0: return [x, y]; break;
            case 1: return [y, x]; break;
            case 2: return [-y, x]; break;
            case 3: return [-x, y]; break;
            case 4: return [-x, -y]; break;
            case 5: return [-y, -x]; break;
            case 6: return [y, -x]; break;
            case 7: return [x, -y]; break;
        }
    }

    geometry.drawLine = function(x1, y1, x2, y2, color) {
        var dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
        var dy = Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
        var err = (dx>dy ? dx : -dy)/2;
        while (true) {
            wall.drawPixel(x1,y1,color);
            if (x1 === x2 && y1 === y2) break;
            var e2 = err;
            if (e2 > -dx) { err -= dy; x1 += sx; }
            if (e2 < dy) { err += dx; y1 += sy; }
        }
    }

    geometry.Rectangle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.draw = function(color, fillColor) {
            geometry.drawRectangle(this.x, this.y, this.width, this.height, color, fillColor);
        };
        this.fill = function(color) {
            geometry.fillRectangle(this.x, this.y, this.width, this.height, color);
        }
    };
    geometry.fillRectangle = function(x, y, width, height, color) {
        for(var _x = x; _x < x + width; _x++) {
            for(var _y = y; _y < y + height; _y++) {
                wall.drawPixel(_x, _y, color);
            }
        }
    };
    geometry.drawRectangle = function(x, y, width, height, color, fillColor) {
        for(var _x = x; _x < x + width; _x++) {
            wall.drawPixel(_x, y, color);
            wall.drawPixel(_x, y + height - 1, color);
        }
        for(var _y = y; _y < y + height; _y++) {
            wall.drawPixel(x, _y, color);
            wall.drawPixel(x + width - 1, _y, color);
        }
        if(typeof fillColor !== 'undefined') {
            for(var _x = x+1; _x < x + width-1; _x++) {
                for(var _y = y+1; _y < y + height-1; _y++) {
                    wall.drawPixel(_x, _y, fillColor);
                }
            }
        }
    };


    wall.public.geometry = geometry;
    wall.public.geom = geometry;
    wall.public.drawLine = geometry.drawLine;
    wall.public.drawRectangle = geometry.drawRectangle;
    wall.public.fillRectangle = geometry.fillRectangle;
    return geometry;
};
