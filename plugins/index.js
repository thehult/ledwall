module.exports = function(wall, app) {
    var plugins = {};


    var fs = require('fs');
    var path = require('path');

    var _pluginnames = require('fs').readdirSync(__dirname).filter(function(file) {
        return fs.statSync(path.join(__dirname, file)).isDirectory();
    });

    _pluginnames.forEach(function(plugin) {
        plugins[plugin] = require(path.join(__dirname, plugin))(wall, app);
    });

    return plugins;
};
