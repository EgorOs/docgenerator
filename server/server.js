const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Insert initial data
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

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


// Get all documents
const getDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
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

app.get('/', (req, res) => 
	MongoClient.connect(url, function(err, client) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");
	 
	  const db = client.db(dbName);
	  
	  getDocuments(db, function(docs) {
	    res.send(docs);
	  });
	}));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))