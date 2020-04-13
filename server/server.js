const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Find all documents
const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}


const getRandomRecordOfType = function(db, type, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.aggregate([
  	{$match: {'type': type}},
  	{$sample: { size: 1 }}]
  	).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}


const getContext = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.group(
  	{key: {'type': 'jurname'}}
  	).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'docgen';

// Server
const express = require('express')
const app = express()
const port = 3000

// Enable CORS (It solves CORS problem, wow!)
// Found here: https://levelup.gitconnected.com/simple-application-with-angular-6-node-js-express-2873304fff0f
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()})

app.get('/:type', (req, res) => 
	MongoClient.connect(url, function(err, client) {
	  assert.equal(null, err);
	 
	  const db = client.db(dbName);
	  
	  getRandomRecordOfType(db, req.params.type, function(docs) {
	    res.send(docs);
	  });
	}));


app.get('/', (req, res) => 
	MongoClient.connect(url, function(err, client) {
	  assert.equal(null, err);
	 
	  const db = client.db(dbName);
	  
	  getContext(db, function(docs) {
	    res.send(docs);
	  });
	}));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
