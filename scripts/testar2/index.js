module.exports = function(id) {
    var Script = function() {
//SCRIPT_PARAMETERS
this.parameters = {test: 1, test2: "a"};
this.test = 1;
this.test2 = "a";

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
