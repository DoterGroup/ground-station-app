var pg = require('pg');
// var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/collector_data';
var connectionString = "postgres://postgres:Ch0pper04@localhost/collector_data";


// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', function() { client.end(); });

var client = new pg.Client(connectionString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT col1 AS "dato" FROM tbltest', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }

    if (result.rows.lenght > 0) {
    	console.log(result.rows[0].dato);
    }

    // client.end();
  });
});

var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var serialPort = new SerialPort("/dev/tty.usbserial-DA00BLCY", {
  baudrate: 57600,
  parser: serialport.parsers.readline("\n")
}, false);


serialPort.open(function (error) {
  if ( error ) {
    console.log('failed to open: '+error);
  } else {
    console.log('Port open.');
    
    serialPort.on('data', function(data) {
      console.log('data: ' + data.toString());

      var results = [];

      // SQL Query > Insert Data
      client.query("INSERT INTO tbltest(col1, col2) values($1, $2)", [data.toString(), 'ok']);

      // SQL Query > Select Data
      var query = client.query("SELECT * FROM tbltest");

      // Stream results back one row at a time
		query.on('row', function(row) {
		    results.push(row);
		});

      // After all data is returned, close connection and return results
		query.on('end', function() {
			// Close clietn connection
		    // client.end();
		    // return res.json(results);
		    console.log(results);
		});


      serialPort.flush();
    });

    serialPort.write("ok:ok\n", function(err, results) {
      console.log('err ' + err);
      console.log('results ' + results);
    });

  }
});