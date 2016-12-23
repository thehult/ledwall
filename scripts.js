

module.exports = function(wall, app) {
    var scripts = {};
    var path = require('path');

    scripts.files = [];

    scripts.change =  function(file) {
        var fileId = path.basename(file);
        for(var i = 0; i < scripts.files.length; i++) {
            if(scripts.files[i].id == fileId) {
                var active = scripts.files[i].active || false;
                try {
                    delete require.cache[file];
                    if(active) {
                        if(typeof scripts.files[i].stop === 'function') {
                            scripts.files[i].stop();
                        }
                    }
                    scripts.files[i] = require(file)(wall);
                    scripts.files[i].id = fileId;
                    scripts.files[i].active = active;
                    if(active) {
                        if(typeof scripts.files[i].start === 'function') {
                            scripts.files[i].start();
                        }
                    }
                    app.io.emit('ScriptChanged', {name: scripts.files[i].name, id: scripts.files[i].id});
                    console.log(file + " changed!");
                } catch(e) {
                    console.log("Could not interpret " + file);
                }
                break;
            }
        }
    }

    scripts.add = function(file) {
        try {
            var script = require(file)(wall);
            script.id = path.basename(file);
            script.active = false;
            scripts.files.push(script);
            console.log(file + " added!");
            app.io.emit('ScriptAdded', {name: script.name, id: script.id});
        } catch(e) {
            console.log("Could not interpret " + file);
        }
    }

    scripts.remove = function(file) {
        var fileId = path.basename(file);
        for(var i = 0; i < scripts.files.length; i++) {
            if(scripts.files[i].id == fileId) {
                scripts.files.splice(i, 1);
                app.io.emit('ScriptRemoved', {id: fileId});
                break;
            }
        }
        console.log(file + " removed!");
    };


    scripts.setIndex = function(fileId, newindex) {
        var file;
        for(var i = 0; i < scripts.files.length; i++) {
            if(scripts.files[i].id == fileId) {
                file = scripts.files[i];
                scripts.files.splice(i, 1);
                scripts.files.splice(newindex, 0, file);
                console.log("Moved script!");
                return true;
            }
        }
        return false;
    }

    scripts.setActive = function(fileId, active) {
        if(typeof active === 'string') {
            active = (active == 'true');
        }
        for(var i = 0; i < scripts.files.length; i++) {
            if(scripts.files[i].id == fileId) {
                scripts.files[i].active = active;
                if(scripts.files[i].active) {
                    if (typeof scripts.files[i].start === 'function') {
                        scripts.files[i].start();
                    }
                    console.log("Script " + scripts.files[i].name + " started!");
                } else {
                    if (typeof scripts.files[i].stop === 'function') {
                        scripts.files[i].stop();
                    }
                    console.log("Script " + scripts.files[i].name + " stopped!");
                }
                return true;
            }
        }
        return false;
    }

    scripts.tick = function() {
        for(var i = 0; i < scripts.files.length; i++) {
            if(scripts.files[i].active && typeof scripts.files[i].tick === 'function') {
                scripts.files[i].tick();
            }
        }
    }

    return scripts;
};
