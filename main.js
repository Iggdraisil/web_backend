const express = require('express');
const app = express();
const port = 8080;
const cors = require("cors");
app.use(cors());
const bodyParser = require('body-parser');
const mongo_db = require("mongodb");
app.use(bodyParser.json({limit: '50mb'}));

app.get('/news', (req, res) => get_from_database("news", res));
app.get('/appeals', (req, res) =>get_from_database("appeals", res));

app.post('/news', function(req, res){
    console.log("news:");
    console.log(req.body);
    res.send("complete!");
    submit_to_database("news", req.body)
});

app.post('/appeals', function(req, res){
    console.log("appeal:");
    console.log(req.body);
    res.send("complete!");
    submit_to_database("appeals", req.body)
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function get_from_database(type, res) {
    let url = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";
    console.log("getting");
    mongo_db.MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) throw err;
        let dbo = db.db("disturbed");
        dbo.collection(type).find({}).toArray((err, result) => {
            if (err) throw err;
            console.log(result);
            res.json(JSON.stringify(result));
            db.close();
        });
    });
}


function submit_to_database(type, object) {
    let url = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

    mongo_db.MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("disturbed");
        console.log(type);
        dbo.collection(type).insertOne(object, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            console.log(res.status)
        })
    })
}