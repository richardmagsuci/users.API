var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {

	app.get('/users/:firstname?', (req, res) => {
		//const fname = JSON.parse(req.body.id);
		db.collection('user_login').findOne(req.params, (err, item) => {
			if (err) {
				res.type('text/plain');
				res.send({ 'error': 'An error has occured' });
				res.end();
			} else {
				res.send(item).end();
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

	app.put('/notes/:id', (req, res) => {
		const id = req.params.id;
		const details = {'_id': new ObjectID(id) };
		const note = { text: req.body.body, title: req.body.title };
		db.collection('notes').update(details, note, (err, item) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(item);
			}
		});
	});

	app.post('/notes', (req, res) => {
		const note = { text: req.body.body, title: req.body.title };
		db.collection('notes').insert(note, (err, result) => {
			if (err) {
				res.send({ 'error': 'An error has occured' });
			} else {
				res.send(result.ops[0]);
			}
		});
	});
};