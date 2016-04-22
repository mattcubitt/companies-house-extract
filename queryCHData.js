var co = require('co');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

co(function*(){
    var db = yield MongoClient.connect('mongodb://localhost:27017/ch');

    var query = yield db.collection('companyDetails').find({'CompanyName': /^Mar/}).toArray();

    debugger;
    yield db.close();
}).catch(err => console.error(err));