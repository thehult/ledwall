module.exports = function(wall, app) {
    var draw = {};
    draw.ctx = wall.ctx;
    draw._pixelData = draw.ctx.createImageData(1, 1);

    draw.createLinearGradient = function(x1, y1, x2, y2, colors) {
        var grd=draw.ctx.createLinearGradient(x1, y1, x2, y2);
        for(var i = 0; i < colors.length; i++) {
            grd.addColorStop(colors[i][0], colors[i][1]);
        }
        return grd;
    };
    draw.createRadialGradient = function(x1, y1, r1, x2, y2, r2, colors) {
        var grd=draw.ctx.createLinearGradient(x1, y1, r1, x2, y2, r2);
        for(var i = 0; i < colors.length; i++) {
            grd.addColorStop(colors[i][0], colors[i][1]);
        }
        return grd;
    };

    draw.drawLine = function(x1, y1, x2, y2, style) {
        draw.ctx.beginPath();
        draw.ctx.strokeStyle = style;
        draw.ctx.moveTo(x1, y1);
        draw.ctx.lineTo(x2, y2);
        draw.ctx.stroke();
    };

    draw.drawRectangle = function(x, y, width, height, style) {
        draw.ctx.strokeStyle = style;
        draw.ctx.strokeRect(x, y, width, height);
    };

    draw.fillRectangle = function(x, y, width, height, style) {
        draw.ctx.fillStyle = style;
        draw.ctx.fillRect(x, y, width, height, style);
    };


    draw.drawPixel = function(x, y, style) {
        draw.ctx.fillStyle = style;
        draw.ctx.fillRect(x, y, 1, 1, style);
    };

    return draw;
};
