var fs = require('fs');

var cfg = {};

try {
    cfg = require('./config.json');
} catch(err) {
    // DEFAULT CONFIG
    cfg = require('./templates/_config.json');
}

cfg.saveConfig = function() {
    fs.writeFile('./config.json', JSON.stringify(cfg, null, 4), function(err) {
        if(err) {
            return console.log(err);
        }
    });
};


module.exports = cfg;
