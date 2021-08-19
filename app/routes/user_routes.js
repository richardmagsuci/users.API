var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {

	app.get('/users', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
				res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
				res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
		db.collection("user_login").find({}).toArray(function(err, result) {
			if (err) {
				res.type('application/json');
				res.send({ 'error': 'An error has occured' });
				res.end();
			} else {
				res.send(result);
			}
		  });
	});

	app.get('/user/:username?/:password?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
		db.collection('users').findOne({uname:req.params.username,upass:req.params.password}, (err, item) => {
			if (err) {
				res.type('application/json');
				res.send({ 'error': 'An error has occured' });
				res.end();
			} else {

				if (item == null) 
				{
					res.status(400).send('Username or password is incorrect.');
				}
				else 
				{
					if (item.status == "Active") res.send(item)
					else res.status(400).send('User access for this account was disabled.');
				};
			}
		});
	});

	app.get('/session/:user_name?/:ip_address?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('userssession').findOne({ipaddress:req.params.ip_address ,username:req.params.user_name,status:"Active"}, (err, item) => {
			if (err) {
				res.type('application/json');
				res.send({ 'error': 'An error has occured' });
				res.end();
			} else {

				if (item == null) 
				{
					res.status(400).send({flag:"N"});
				}
				else 
				{
					res.send(item);
				};
			}
		});
	});

	app.get('/activesession/:ip_address?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('userssession').findOne({ipaddress:req.params.ip_address,status:"Active"}, (err, item) => {
			if (err) {
				res.type('application/json');
				res.send({ 'error': 'An error has occured' });
				res.end();
			} else {
				if (item == null) 
				{
					res.status(400).send({flag:"N"});
				}
				else 
				{
					res.send(item);
				};
			}
		});
	});

	app.post('/session/:username?/:ip_address?', (req, res) => {
		const dtnow = new Date().getTime();
		const log = { ipaddress: req.params.ip_address,
						username:req.params.username,
						status: "Active"};
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('userssession').insert(log, (err, result) => {
			
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});

	app.put('/users_update/:id?', (req, res) => {
		const user = { firstname: req.params.firstname, 
			lastname: req.params.lastname, 
			username: req.params.username,
			password: req.params.password};
		db.collection('users').update(req.params, user, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(item);
			}
		});
	});

	app.delete('/users/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		db.collection('users').remove(details, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send('Note ' + id + ' deleted!');
			}
		});
	});

	app.post('/remove_session/:ip_address?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('users').remove(req.params, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send('S');
			}
		});
	});

	app.post('/users_new/:firstname?/:lastname?/:username?/:password?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		const user = { firstname: req.params.fname, 
					   lname: req.params.lastname, 
					   uname: req.params.username,
					   upass: req.params.password,
						user_type: "User",
					   status: "Active"};
		db.collection('users').insert(user, (err, result) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});
};
