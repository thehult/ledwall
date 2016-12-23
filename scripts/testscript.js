module.exports = function(Wall){
    var script = {};

    script.name = "Test Script";

    var currentX = 0;
    var currentY = 0;
    var colors = [Wall.color.fromHEX("#f00")];
    var clearColor = {r: 0, g: 0, b: 0};

    script.start = function() {
        Wall.clear();
    };

    var rect = new Wall.geom.Rectangle(8, 8, 7, 7);

    var p1 = new Wall.geom.Point(2,2);
    var p2 = new Wall.geom.Point(32, 13);

    script.tick = function() {
        Wall.drawLine(14, 7, 51, 7, Wall.color.Red);
        rect.draw(Wall.color.Red, Wall.color.Pink);
        Wall.drawPixel(currentX, currentY, clearColor);
        currentX = currentX + 1;
        if(currentX >= Wall.width) {
            currentX = 0;
            currentY = currentY + 1;
            if(currentY >= Wall.height) {
                currentY = 0;
            }
        }
        Wall.drawPixel(currentX, currentY, colors[(currentX + currentY) % colors.length]);
    };


    return script;
};
