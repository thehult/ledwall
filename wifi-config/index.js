var ifconfig = require('wireless-tools/ifconfig');
var hostapd = require('wireless-tools/hostapd');
var udhcpd = require('wireless-tools/udhcpd');
var udhcpc = require('wireless-tools/udhcpc');
var iwlist = require('wireless-tools/iwlist');
var wpa_supplicant = require('wireless-tools/wpa_supplicant');

var series = require('async/series');
var until = require('async/until');

var http = require('http');

var fs = require('fs');

module.exports = function(opts, cb) {
    var wifiNetworks = [];

    function _log(str) {
        if(logging)
            console.log("wifi-config: " + str);
    }

    function handleRequest(req, res) {
        _log("Got a request")

        var resp = "";
        for(var i = 0; i < wifiNetworks.length; i++) {
            resp += wifiNetworks[i].ssid + "\n";
        }

        res.end(resp);
    }

    function _ifconfig_wait_for_up(cb) {
        var isUp = false;
        until(function() {
            return isUp;
        }, function(_cb) {
            _log("Checked status");
            ifconfig.status(options.interface, function(err, status) {
                if(err) return _cb(err);
                if(typeof status === 'undefined')
                    return _cb(null);
                if(typeof status.ipv4_address !== 'string')
                    return _cb(null);
                isUp = true;
                _log("Up on ip: " + status.ipv4_address);
                return _cb(null);
            });
        }, function(err, results) {
            if(err) return cb(err);
            cb(null);
        });

    }

    function _iwlist_scan(cb) {
        var nets = [];
        until(function() {
            return nets.length > 0;
        }, function(_cb) {
            iwlist.scan({ iface: options.interface, show_hidden: true}, function(err, networks) {
                if(typeof networks !== 'undefined')
                    nets = networks;
                _cb(null);
            });
        }, function(err, results) {
            wifiNetworks = nets;
            _log("Scanned wifi");
            cb(null, nets);
        });

    }

    function _ifconfig_down(cb) {
        ifconfig.down(options.interface, function(err) {
            if(err) cb(err, "");
            _log(options.interface + " down");
            cb(null);
        });
    }

    function _ifconfig_up(cb) {
        options.iface.interface = options.interface;
        ifconfig.up(options.iface, function(err) {
            if(err) return cb(err);
            _log(options.interface + " up");
            cb(null);
        });
    }

    function _ifconfig_up_dynamic(cb) {
        ifconfig.exec('ifconfig ' + options.interface + ' 0.0.0.0 0.0.0.0', function(err) {
            if(err) return cb(err);
            _log(options.interface + " up");
            cb(null);
        });
    }

    function _udhcpd_disable(cb) {
        udhcpd.disable(options.interface, function(err) {
            if(err) return cb(err);
            _log("udhcpd disabled");
            cb(null);
        });
    }

    function _udhcpd_enable(cb) {
        options.dhcp.interface = options.interface;
        udhcpd.enable(options.dhcp, function(err) {
            if(err) return cb(err);
            _log("udhcpd enabled");
            cb(null);
        });
    }

    function _hostapd_disable(cb) {
        hostapd.disable(options.interface, function(err) {
            if(err) return cb(err);
            _log("hostapd disabled");
            cb(null);
        });
    }

    function _hostapd_enable(cb) {
        options.accessPoint.interface = options.interface;
        hostapd.enable(options.accessPoint, function(err) {
            if(err) return cb(err);
            _log("hostapd enabled");
            cb(null);
        });
    }

    function _udhcpc_enable(cb) {
        udhcpc.enable({interface: options.interface}, function(err) {
            if(err) return cb(err);
            _log("udhcpc enabled");
            cb(null);
        });
    }


    function startAccessPoint() {
        _log("Starting Access Point");

        series([
            _hostapd_disable,
            _udhcpd_disable,
            _ifconfig_down,
            _ifconfig_up,
            _iwlist_scan,
            _udhcpd_enable,
            _hostapd_enable
        ], function(err, results) {
            if(err) return callback(err);
            console.log(results);
            accessPoint_started();
        });

    }

    var con_ssid;
    var con_psk;
    function _connectWifi(cb) {
        var cont = fs.readFileSync("/etc/wpa_supplicant/wpa_supplicant.conf", {encoding: "utf8"});
        cont = cont.replace(/network={(.|\n|\r)*}/gm, "");
        cont += "\r\nnetwork={\r\n\tssid=\"" + con_ssid + "\"\r\n\tpsk=\"" + con_psk + "\"\r\n}";
        fs.writeFileSync("/etc/wpa_supplicant/wpa_supplicant.conf", cont);
        cb(null);
    };

    function connectToWifi(ssid, pass, callback) {
        console.log("SSID: " + ssid + ", pass: " + pass);
        var opts = {
            interface: options.interface,
            ssid: ssid,
            passphrase: pass,
            driver: 'wext'
        };
        con_ssid = ssid;
        con_psk = pass;
        series([
            _hostapd_disable,
            _udhcpd_disable,
            _ifconfig_down,
            _connectWifi,
            _ifconfig_up_dynamic
        ], function(err, results) {
            if(err) return callback(err);
            callback(null);
            //wpa_supplicant.enable(opts, callback);c
        });
    }

    function accessPoint_started() {
        var app = require('./app.js');
        app.start(options.http.port || 3000, options.iface.ipv4_address, wifiNetworks, connectToWifi, function(adr, port) {
            _log("Server started at " + adr + ":" + port);
        });
    }




    var options = opts;
    var callback = cb;
    var logging = opts.logging || false;
    console.log(logging);
    _log("Checking " + opts.interface + " status");
    ifconfig.status(function(err, status) {
        if(err) return callback("Could not call ifconfig.");
        if(typeof status === 'undefined')
            return callback("No such interface.");
        if(typeof status.ipv4_address !== 'string') {
            console.log("No ipv4: " + status.ipv4_address);
            startAccessPoint();
        }
    });
};
