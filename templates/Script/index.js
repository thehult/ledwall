module.exports = function(id) {
    var Script = function() {
//SCRIPT_PARAMETERS
//SCRIPT_PARAMETERS_END

//SCRIPT_START
//SCRIPT_START_END
    };

    Script.prototype.id = id;

    Script.prototype.tick = function() {
//SCRIPT_TICK
//SCRIPT_TICK_END
    };

    Script.prototype.stop = function() {
//SCRIPT_STOP
//SCRIPT_STOP_END
    };

    return Script;
};
