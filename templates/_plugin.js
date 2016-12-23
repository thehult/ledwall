module.exports = function(){
    var plugin = {};
    plugin.name = "Template Plugin";
    plugin.config = {

    };


    plugin.start = function() {
        console.log("start!");
     };

    plugin.tick = function() {
        console.log("update!");
    };

    return plugin;
};
