module.exports = function(_wall, app) {
    var wall = {};

    wall.width = _wall.width;
    wall.height = _wall.height;

    wall.getDataURL = _wall.getDataURL;

    return wall;
};
