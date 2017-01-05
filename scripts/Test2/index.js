module.exports = function(id) {
    var Script = function() {
        //SCRIPT_START
        Util.log("Script 2 started!");
        Drawing.drawRectangle(0, 0, Wall.width, Wall.height, Colors.Blue);
        Util.log('<img src="' + Wall.getDataURL() + '">');
    };

    Script.prototype.id = id;

    Script.prototype.tick = function() {
        //SCRIPT_TICK
        //Util.log("Script tick!");
    };
    return Script;
};
