module.exports = function(_plugins){
    var script = {};
    script.name = "Template Script";

    this.plugins = _plugins;

    script.start = function() {
        console.log("start!");
    };

    script.tick = function() {
        console.log("update!");
    };

    return script;
};
