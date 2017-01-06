var app = require('express')();
var exphbs = require('express-handlebars');
var querystring = require('querystring');

var networks = {};

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: __dirname+'/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('home', {networks: networks});
});

app.get('/connect/:index', function(req, res) {
    console.log("BAJS:" + req.params.index);
    if(typeof req.query.password === 'undefined') {
        res.render('connect', {
            network: networks[req.params.index],
            index: req.params.index
        });
    } else {
        app.connectCallback(networks[req.params.index], req.query.password, function(err) {
            if(err)
                res.render('home', {networks: networks});
            res.render('connecting');
        });
        res.render('connecting', {
            network: networks[req.params.index]
        });
    }
});


module.exports = {

    start: function(port, hostname, _networks, _connectCallback, callback) {
        app.connectCallback = _connectCallback;
        for(var i = 0; i < _networks.length; i++) {
            var net = _networks[i];
            networks[net.address] = net.ssid;
            //networks.push(net.ssid);
        }
        app.listen(port, hostname, function() {
            callback(hostname, port);
        });
    }

}
