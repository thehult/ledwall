module.exports = function(wall, app) {
    var util = {};

    util.log = function(str) {
        console.log(str);
        app.io.emit("UtilLog", {str: str});
    }

    return util;
};
