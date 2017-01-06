var app = require('express')();
var exphbs = require('express-handlebars');
var querystring = require('querystring');

app.networks = {};

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname+'/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('home', {networks: app.networks});
});

app.get('/connect/:index', function(req, res) {
    console.log("BAJS:" + req.params.index);
    if(typeof req.query.password === 'undefined') {
        res.render('connect', {
            network: app.networks[req.params.index],
            index: req.params.index
        });
    } else {
        console.log(app.networks);
        console.log(req.params.index);
        app.connectCallback(app.networks[req.params.index], req.query.password, function(err) {
            if(err)
                return console.log(err);
            //res.render('connecting');
            console.log("Connected!");
        });
        res.render('connecting', {
            network: app.networks[req.params.index]
        });
    }
});


module.exports = {

    start: function(port, hostname, _networks, _connectCallback, callback) {
        app.connectCallback = _connectCallback;
        for(var i = 0; i < _networks.length; i++) {
            var net = _networks[i];
            app.networks[net.address] = net.ssid;
            //networks.push(net.ssid);
        }
        app.listen(port, hostname, function() {
            callback(hostname, port);
        });
    }

}
