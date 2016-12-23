module.exports = function(Wall){
    var script = {};

    console.log("REQUIRED!");

    script.name = "Test";

    script.start = function() {
        console.log("started!");
     };

    script.tick = function() {
        console.log("tick igen");
    };


    return script;
};
