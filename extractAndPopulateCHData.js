var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var unzip = require('unzip2');
var Converter = require("csvtojson").Converter;
var converter = new Converter({ constructResult: false });
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

request('http://download.companieshouse.gov.uk/en_output.html', (error, response, body) => {
    var $ = cheerio.load(body);

    var urls = $('.grid_7.push_1.omega li a')
        .toArray()
        .map(link => link && link.attribs ? link.attribs.href : '');

    for(var url of urls) {
        request(`http://download.companieshouse.gov.uk/${url}`)
            .pipe(unzip.Parse())
            .on('entry', (entry) => entry.pipe(converter))
            .on('finish', () => {
                debugger;
            });
    }
});

MongoClient.connect('mongodb://localhost:27017/ch', function(err, db) {
    converter.on("record_parsed", function (json) {
        db.collection('companyDetails').insertOne(json, function(err, result) {
            if(err !== null) {
                console.error(err)
            }
        });
    });
});