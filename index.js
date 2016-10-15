var express  = require('express'), http = require('http');
var pg = require('pg');
var serialport = require("serialport");
var moment = require('moment');
var morgan = require('morgan');


//* set up our express application *//
var app = express();
var server = http.createServer(app);
server.listen(8080);

var io = require('socket.io').listen(server);

// log every request to the console
app.use(morgan('dev'));

// route public files
app.use(express.static('public'));

// set up ejs for templating
app.set('view engine', 'ejs');

// database ======================================================================
var connectionString = "postgres://postgres:Ch0pper04@localhost/collector_data";

var client = new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    return console.error('Could not connect to postgres', err);
  }
  client.query('SELECT id AS "indxs" FROM tbldata', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }

    if (result.rows.length > 0) {
    	console.log(result.rows[0].indx);
    }

    // client.end();
  });
});

// serial connection =============================================================
// localize object constructor
var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("/dev/tty.usbserial-DA0071OQ", {
  baudrate: 57600,
  parser: serialport.parsers.readline("\n")
}, false);


serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: ' + error);
  } else {
    console.log('Port open.');
    
    serialPort.on('data', function(data) {
      console.log('data: ' + data.toString());
      data = data.toString();
      data = data.replace('[', '');
      data = data.replace(']', '');
      data = data.split(',');
      console.log(data.length)

      var results = [];

      if (data.length == 12) {
      	var status = 'DISARM';
      	if (data[0] == 'True') {
      		status = 'ARM';
      	}

      	var mode = data[1];
      	var batt = data[2];

      	var lat = data[3];
      	var long = data[4];
      	var alt = data[5];

      	var speed = parseFloat(data[10]).toFixed(2);

      	var pressure = parseFloat(data[6]).toFixed(2);
      	var temp = parseFloat(data[7]).toFixed(2);
      	var humidity = parseFloat(data[8]).toFixed(4);
      	var temp2 = parseFloat(data[9]).toFixed(4);

      	var co = parseFloat(data[11]).toFixed(2);

	      // SQL Query > Insert Data
	      client.query("INSERT INTO tbldata(latitude, longitude, altitude, speed, pressure, temperature, humidity, temperature_2, uv, co, no2, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, 0, $9, 0, NOW(), NOW())", [lat, long, alt, speed, pressure, temp, humidity, temp2, co]);
	      console.log('Data inserted!');

	      // SQL Query > Select Data
	      var query = client.query("SELECT *, cast(created_at as time) AS time FROM tbldata ORDER BY id DESC LIMIT 15");

	      // Stream results back one row at a time
	      query.on('row', function(row) {
			    results.push(row);
		  });

	      // After all data is returned, close connection and return results
			query.on('end', function() {
			    // console.log(results);
			    dataset = {
			    	labels: [],
			    	temp: [],
			    	labels2: [],
			    	humidity: [],
			    	labels3: [],
			    	pressure: [],
			    	labels4: [],
			    	co: [],

			    	status: status,
			    	mode: mode,
			    	batt: batt,
			    	lat: lat,
			    	long: long,
			    	alt: alt,
			    	speed: speed
			    }

			    var l = [], t = [];
			    var l2 = [], h = [];
			    var l3 = [], p = [];
			    var l4 = [], c = [];

			    for (var i = results.length - 1; i >= 0; i--) {
			    	json = results[i];

			    	tiempo = json.time.split(':');
			    	tiempo = tiempo[0] + ':' + tiempo[1];

			    	l.push(tiempo);
			    	t.push(parseFloat(json.temperature).toFixed(2));

			    	l2.push(parseFloat(json.temperature_2).toFixed(2) + '*');
			    	h.push(parseFloat(json.humidity).toFixed(2));

			    	l3.push(json.altitude + 'm');
			    	// hPa
			    	p.push(parseFloat(json.pressure/100).toFixed(2));

			    	// CO
			    	var Ro = 10000.0;    // this has to be tuned 10K Ohm
			    	var Vrl = parseFloat(json.co).toFixed(2) * (3.3 / 1024.0);
			    	var Rs = (3.3 - Vrl) * (Vrl / Ro);
			    	var ratio =  Rs/Ro;
			    	var ppm =  Math.pow(( (Rs/Ro)/22.07 ), (1/-0.0667));

			    	l4.push(Vrl.toFixed(4));

			    	c.push(Rs.toFixed(4));
			    }

			    dataset.labels = l;
			    dataset.temp = t;

			    dataset.labels2 = l2;
			    dataset.humidity = h;

			    dataset.labels3 = l3;
			    dataset.pressure = p

			    dataset.labels4 = l4;
			    dataset.co = c

			    io.sockets.emit('setData', dataset);
			    // client.end();
			});
		}

		serialPort.flush();
    });

    serialPort.write("ok:ok\n", function(err, results) {
    	if (err) {
    		console.log('err ' + err);
    	}
      // console.log('results ' + results);
    });

  }
});

// routes ======================================================================
// load our routes
require('./controller/routes.js')(app, serialPort);

// launch ======================================================================
function empty(object) {
  for (var i in object) 
    if (object.hasOwnProperty(i))
      return false;
 
  return true;
}

function setTime(time) {
    var str = String(time);
    var res = str.substring(16, 21);
    return res;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Socket.io ======================================================================
io.on('connection', function (socket) {
	console.log("Connecting sockets...");
	io.sockets.emit('comm', "Server On.");
  // setInterval(function(){
  // 	var data = [];

  // 	for (var i = 0; i < 7; i++) {
  // 		data.push(getRandomInt(0,60));
  // 	}

  //   io.sockets.emit('setData', data);
  // },5000);

});

console.log('Drone Data Collector System on port 8080');