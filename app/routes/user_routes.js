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
		db.collection('user_login').findOne(req.params, (err, item) => {
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

	app.get('/session/:username?/:ip_address?', (req, res) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('sessions').findOne({ip_address:req.params.ip_address ,username:req.params.username,status:"Active"}, (err, item) => {
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
		db.collection('sessions').findOne({ip_address:req.params.ip_address,status:"Active"}, (err, item) => {
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
		const log = { ip_address: req.params.ip_address,
						username:req.params.username,
						status: "Active",
						timestamp: dtnow};
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
		db.collection('sessions').insert(log, (err, result) => {
			
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				console.log(result.ops[0]);
				res.send(result.ops[0]);
			}
		});
	});

	app.delete('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		db.collection('notes').remove(details, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send('Note ' + id + ' deleted!');
			}
		});
	});

	app.put('/users_update/:id?', (req, res) => {
		const user = { firstname: req.params.firstname, 
			lastname: req.params.lastname, 
			username: req.params.username,
			password: req.params.password};
		db.collection('notes').update(req.params, user, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(item);
			}
		});
	});

	app.post('/users_new/:firstname?/:lastname?/:username?/:password?', (req, res) => {
		const user = { firstname: req.params.firstname, 
					   lastname: req.params.lastname, 
					   username: req.params.username,
					   password: req.params.password};
		db.collection('user_login').insert(user, (err, result) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});
};