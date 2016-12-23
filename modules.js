module.exports = function(app) {
    var modules = [];

    require('fs').readdirSync(__dirname + '/modules').forEach(function(file) {
        var module = require(__dirname + '/modules/' + file)(app);
        modules.push(module);
    });

    return modules;
};
