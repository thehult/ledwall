module.exports = function(id) {
    var Script = function() {
        //SCRIPT_START
        Util.log("Script started!");
        this.i = 0;
        //SCRIPT_START_END
    };

    Script.prototype.id = id;

    Script.prototype.tick = function() {
        //SCRIPT_TICK
        //Util.log("Script tick!");

        Drawing.drawPixel(this.i % Wall.width, parseInt(this.i/Wall.width), Colors.Black);

        this.i = (this.i + 1) % (Wall.width*Wall.height);

        Drawing.drawPixel(this.i % Wall.width, parseInt(this.i/Wall.width), Colors.Red);

        //SCRIPT_START_END
    };
    return Script;
};
