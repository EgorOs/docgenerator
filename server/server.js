const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Insert initial data
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
  	{type: 'name', value: 'Joseph'},
  	{type: 'name', value: 'Jonathan'},
  	{type: 'name', value: 'Tom'},
  	{type: 'content', value: 'This is important message'},
  	{type: 'content', value: 'Some message'}
  ], function(err, result) {
    assert.equal(err, null);
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


const getRandomRecordOfType = function(db, type, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents .aggregate([ { $sample: { size: 1 } } ])
  collection.aggregate([
  	{$match: {'type': type}},
  	{$sample: { size: 1 }}]
  	).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'docgen';

// Data upload
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
 
//   const db = client.db(dbName);
  
//   insertDocuments(db, function(docs) {
//     client.close();
//   });
// });


// Server
const express = require('express')
const app = express()
const port = 3000

app.get('/:type', (req, res) => 
	MongoClient.connect(url, function(err, client) {
	  assert.equal(null, err);
	  console.log("Connected successfully to server");
	 
	  const db = client.db(dbName);
	  
	  getRandomRecordOfType(db, req.params.type, function(docs) {
	    res.send(docs);
	  });
	}));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
