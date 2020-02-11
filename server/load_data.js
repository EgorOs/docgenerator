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
  	{type: 'content', value: `
Hallo Thomas,
hier nochmal meine Rechnungen und Anschreiben zu der Streitgeschichte.
Einen schriftlichen Architektenvertrag hat es, wie immer wenn ich für meinen Cousin gearbeitet habe, nicht gegeben. Das lief alles mündlich, und bis dahin habe ich auch immer mein Honorar bekommen, auch wenn es meist nicht allzu schnell überwiesen wurde.
Der Planungsauftrag für die offenen Rechnungen belief sich auf eine Grundlagenermittlung, Vorentwurfs- und Entwurfsplanung einschl. 3D-Darstellung, in mehreren Varianten für eine Umnutzung einer seiner Hallen plus einen Verwaltungsneubau dazu.
Anbei sende ich Dir zusätzlich zu den Rechnunaen den letzten Planungsstand, den mein Cousin auch so bekommen und an seinen Mietinteressenten (Fa. Gilato aus Hattingen, die verlegt bundesweit Glasfaserkabel) weitergeleitet hat.
Gruss, Dieter
`},
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
   {type: 'content', value: `
In dem Rechtstreit
Manfred König
gegen
AHA-Bau GmbH u.a.
zeige ich an, den Beklagten zu 3) anwaltlich zu vertreten. Vollmachtabschrift liegt an.
Wir zeigen hiermit Verteidigungsbereitschaft an.
Das Gericht wird höflich darum ersucht, dem Unterzeichner die Gerichtsakte zur Einsicht- nahme in den
Büroräumen des Unterzeichners für 3 Tage zur Verfügung zu stellen.
Aus der übersandten Klageerwiderungsschrift vom 2. November 2015 Iässt sich der Sachverhalt nicht
hinreichend entnehmen.
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