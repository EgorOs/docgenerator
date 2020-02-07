const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'docgen';

const dropDatabase = function(db, callback){
	const collection = db.collection('documents');
	collection.remove()
}
 
// Insert initial data
const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
  	// names
  	{type: 'name', value: 'Katja Schwab'},
  	{type: 'name', value: 'Peter Eberhardt'},
  	{type: 'name', value: 'Dieter Adams'},
  	{type: 'name', value: 'Manfred König'},

  	// addresses
  	{type: 'address', value: 'Leopoldstraße 6, 57074 Siegen'},
  	{type: 'address', value: 'Luckenwalder Strasse 77, 29362 Hohne'},

  	// datetime
  	{type: 'datetime', value: '22. Jan. 2019 20:44'},
  	{type: 'datetime', value: '10.11.2015'},

  	// phone
  	{type: 'phone', value: '+49 (0)221 94373 6000 612'},
  	{type: 'phone', value: '0231/926-0'},

  	// fax
  	{type: 'fax', value: '+49 (0)221 94373 6000 1612'},
  	{type: 'fax', value: '0231-926-10600'},

  	// email
  	{type: 'email', value: 'info@ra-goldschmidt.de'},
  	{type: 'email', value: 'k.adams@adams-kö.de'},

  	// contents
  	{type: 'content', value: `Hallo Thomas,
							  anbei wie tel. besprochen meine offenen Rechnungen sowie das Anschreiben dazu. 
							  Ausserdem, damit Du einen Überblick hast, die Bauzeitenverzögerung durch die Umplanung aufgrund meines Fehlers. 
							  Hier: 2 verschiedene Bauzeitenpläne des Bauunternehmers, einmal vor und einmal nach dem Schadenseintritt. 
							  Den Mailverkehr mit der VHV und mit meinem Cousin sende ich Dir cc separat aus dem Mailordner, falls gewünscht. Zunächst mal geht es ja darum, meinen offenen Honorarrechnungen nachzugehen. 
							  Der Streit um die Schadenssumme ist, wie erwähnt, von einem anderen Bauvorhaben 
							  Danke schonmal, dass Du Dich der Sache annimmst. 
							  Melde Dich bitte, sobald Du irgendwelche Unterlagen benötigst, um den ganzen Komplex besser verstehen zu können.`},
  	{type: 'content', value: ` 
							Mit E-Mail vom 16.02.2015 rügte der Bauherr gegenüber der Klägerin 
							einen neuen Mangel im Dachbereich und forderte die Klägerin dazu auf, 
							diesen Mangel in angemessener Frist zu beseitigen. Die Klägerin leitete 
							die Mängelrüge des Bauherrn an 17.02.2015 an die Beklagte weiter. Die 
							Beklagte entsandte am 18.02.2015 zwei Mitarbeiter zum Bauvorhaben, 
							um die Mängelrüge des Bauherrn zu überprüfen und gegebenenfalls 
							Mängelbeseitigungsarbeiten durchzuführen. Dort erklärte Herr Franke, 
							ein Gesellschafter des Bauherrn, den Mitarbeitern der Beklagten, dass er 
							ihnen den Zutritt zu den Dachflächen nicht gewähre, da der Bauherr 
							keine Arbeiten durch die Beklagte an den Dachflächen mehr zulasse. 
  	`},
  ], function(err, result) {
    assert.equal(err, null);
    callback(result);
  });
}

//Data upload
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
  
  insertDocuments(db, function(docs) {
    client.close();
  });
});