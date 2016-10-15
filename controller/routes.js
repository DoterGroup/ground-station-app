module.exports = function(app, serial) {
	// app/routes.js
	var pg = require('pg');
	
	// connection.query('USE ' + dbconfig.database);

	function querySelect (table) {
		var query='SELECT * FROM '+table+'';
		return query;
	}
	
	function querySelectOrder(table,order){
		var query='SELECT * FROM '+table+' ORDER BY id ' + order + ' LIMIT 100';
		return query;
	}

	function updateQuery (table,title,cycle,certificate,institution,phone,street,suburb,town,company,cp,c_street,c_suburb,c_town,product,scaffold,crust,thick,quantity,id) {
		var query = 'UPDATE '+table+' SET title = "'+ title +'", cycle = "'+ cycle +'", certificate = "'+ certificate +'",\
			institution = "'+ institution +'", phone = "'+ phone +'", street = "'+ street +'", suburb = "'+ suburb +'", \
			town = "'+ town +'",company = "'+ company +'",cp = "'+ cp +'",c_street = "'+ c_street +'",c_suburb = "'+ c_suburb +'",c_town = "'+ c_town +'",\
			product = "'+ product +'",scaffold = "'+ scaffold +'", crust = '+ crust +', \
			thick = "'+ thick +'", quantity = '+ quantity +' WHERE id ='+ id +'';
		return query;
	}

	function insertQuery (table,title,cycle,certificate,institution,phone,street,suburb,town,company,cp,c_street,c_suburb,c_town,product,scaffold,crust,thick,quantity,status) {
		var query = 'INSERT INTO '+table+' (title, cycle,certificate,institution,phone,street,suburb,\
			town,company,cp,c_street,c_suburb,c_town,product,scaffold,crust,thick,quantity,status,date_start,date_end)\
			VALUES("'+title+'","'+cycle+'","'+certificate+'","'+institution+'","'+phone+'","'+street+'","'+suburb+'","'+town+'",\
			"'+company+'","'+cp+'","'+c_street+'","'+c_suburb+'","'+c_town+'",\
			"'+product+'","'+scaffold+'",'+crust+',"'+thick+'",'+quantity+','+status+',now(),now());';

		return query;
	}

	function crustValue(crust){
		if (crust == "0" ) {
			crust=false;
		}else{
			crust=true;
		};
		return crust;
	}

	function twoDigits(d) {
	  if(0 <= d && d < 10) return "0" + d.toString();
	  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	  return d.toString();
	} 

	Date.prototype.toMysqlFormat = function() {
	  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
	};

	function empty(object) {
	  for (var i in object) 
	    if (object.hasOwnProperty(i))
	      return false;
	 
	  return true;
	}	

	app.get('/', isLoggedIn, function(req, res) {

		res.render('index.ejs', {
					user : "user", 
					empty : "false",
					reference: "raference",
					data: "dataList",
					pageSize: "pageSize",
					dataTotal: "dataTotal",
					pageCount: "pageCount",
					currentPage: "currentPage"
		});	

	});

	// Flight modes
	app.post('/mode/:id', isLoggedIn, function(req, res) {
		var id = req.params.id;
		
		serial.write("mode:" + id + "\n", function(err, results) {
			console.log('err ' + err);
			console.log('results ' + results);
		});	
	});

	// Module Settings
	app.get('/settings', isLoggedIn, function(req, res) {
		var user = req.user;
		connection.query('SELECT * FROM data_default',function (err, data_default) {		
			res.render('settings.ejs', {
				user : user , data : data_default, message: req.flash('successUpdate')
			});			
		});
	});


	// Module Profile
	app.get('/profile', isLoggedIn, function(req, res) {
		connection.query('SELECT reference, wet, timeOut FROM data_default',function (err, data) {
			console.log(data);
			res.render('profile.ejs', {
				user : req.user , reference: data
			});
		});
		
	});

	app.post('/profile/put/:id', isLoggedIn, function(req, res) {	
		var id = req.params.id;
		var nick = req.body.nick;
		var user = req.body.user;
		var psw = req.body.psw;
		var pswReal = bcrypt.hashSync(psw, null, null);
		
		connection.query('UPDATE users SET nickname="'+nick+'", username="'+user+'",password="'+pswReal+'" WHERE id='+id+';',
		function (err, data) {			
			console.log("update success");		
			res.json({data: data});	
			console.log(data);
		});	
	});

};

function isLoggedIn(req, res, next) {

	// if (req.isAuthenticated())
	// 	return next();

	// res.redirect('/login');

	return next();
}

function isNotLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		res.redirect('/');

	return next();
	
}