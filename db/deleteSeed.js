require('dotenv/config');
const MongoClient = require('mongodb');
const url = process.env.URL_DB;
const databasename = 'phonex'; // Database name
MongoClient.connect(url)
	.then(client => {
		// Reference of database
		const connect = client.db(databasename);

		// Dropping the database
		connect.dropDatabase();

		console.log('Dropping successful');
	})
	.catch(err => {
		console.log(err);
	});
