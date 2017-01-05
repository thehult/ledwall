

module.exports = function(wall, app) {
    var scripts = {};
    var path = require('path');

    scripts.files = {};
    scripts.activated = [];

    scripts.getScriptNameFromPath = function(file) {
        var dir = path.dirname(file);
        var dirs = dir.split(path.sep);
        return dirs[dirs.length - 1];
    }

    scripts.change =  function(file) {
        try {
            var fileId = scripts.getScriptNameFromPath(file);

            delete scripts.files[fileId];
            delete require.cache[file];
            scripts.files[fileId] = require(file)(fileId);
            console.log(fileId + " changed! Path: " + file);
            for(var i = 0; i < scripts.activated.length; i++) {
                var s = scripts.activated[i];
                if(s.id == fileId) {
                    scripts.activated[i] = null;
                    scripts.activated[i] = new scripts.files[fileId]();
                    console.log("Rerun script " + fileId + "!");
                }
            }
        } catch(e) {
            console.log("Could not interpret " + file);
        }
    }

    scripts.add = function(file) {
        try {
            var fileId = scripts.getScriptNameFromPath(file);
            if(fileId == "scripts") return;
            scripts.files[fileId] = require(file)(fileId);
            console.log(fileId + " added! Path: " + file);
            app.io.emit('ScriptAdded', {id: fileId});
        } catch(e) {
            console.log("Could not interpret " + file);
        }
    }

    scripts.remove = function(file) {
        var fileId = scripts.getScriptNameFromPath(file);
        delete scripts.files[fileId];
        scripts.files.splice(i, 1);
        for(var i = scripts.activated.length - 1; i >= 0; i--) {
            if(scripts.activated[i].id == fileId) {
                scripts.splice(i, 1);
            }
        }
        app.io.emit('ScriptRemoved', {id: fileId});
        console.log(fileId + " removed! Path: " + file);
    };


    scripts.scriptMove = function(oldIndex, newIndex) {
        console.log("Moving " + oldIndex + " to " + newIndex);
        console.log(scripts.activated);
        var s = scripts.activated.splice(oldIndex, 1);
        console.log("MOVING " + s);
        scripts.activated.splice(newIndex, 0, s[0]);
        console.log(scripts.activated);
        console.log("Moved item!");
    }

    scripts.scriptActivate = function(fileId) {
        scripts.activated.push(new scripts.files[fileId]());
        console.log("Activated " + fileId);
    }

    scripts.scriptDeactivate = function(index) {
        scripts.activated.splice(index, 1);
        console.log("Deactivated " + index);
    }

    scripts.getParameters = function(index) {
        return JSON.stringify(scripts.activated[index].parameters);
    }

    scripts.tick = function() {
        for(var i = 0; i < scripts.activated.length; i++) {
            if(typeof scripts.activated[i].tick === "function") {
                //console.log("Ticking " + i);
                scripts.activated[i].tick();
            } else {
                console.log("Failed ticking " + i);
                console.log(scripts.activated[i]);
            }
        }
    }

    return scripts;
};
