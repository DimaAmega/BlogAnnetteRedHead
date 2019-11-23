const MongoClient = require('mongodb').MongoClient;

function Connect() {
    var url = 'mongodb://localhost:27017/';
    // var dbName = "BlogAnnetteRedhead";
    return MongoClient.connect(url,{ useNewUrlParser: true });
};
module.exports = Connect;

