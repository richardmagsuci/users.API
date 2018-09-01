const express     = require ('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser  = require('body-parser');
const db		  = require('./config/db');

const app		  = express();

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('/user'));
app.use('/', express.static('/users'));
app.use('/', express.static('/users_new'));
app.use('/', express.static('/users_update'));
app.use('/', express.static('/test'));
app.use('/', express.static('/session'));
app.use('/', express.static('/activesession'));

MongoClient.connect(db.url, (err, database) => {
	if (err) return console.log(err)
	require('./app/routes')(app, database);
	app.listen(process.env.PORT || port, () => {
		console.log("We are live on " + port);
	})

})