/**
 * Created by Teemu on 04-Apr-17.
 */
//Morgan = HTTP request logger to log the HTTP requests coming to the server.js

'use strict';
const express = require('express');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const http = require('http');
const cookieParser = require('cookie-parser');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');



let users = [{id: 0, name: 'Liza'},{id: 1, name : 'Carl'}];

const options = {
    key: sslkey,
    cert: sslcert
};


mongoose.Promise = global.Promise; //ES6 Promise

const app = express();
app.use(cookieParser());

//for webcam
//app.use(express.static('publix'));

//for other routing shit
app.use(express.static('public'));

app.use(require('./routes'));
/*app.get('/', (req, res) => {
    const cookie = req.cookies.testCookies;
    const timex = moment().format('MMMM Do YYYY, h:mm a');
    if (cookie === undefined){
        res.cookie('testCookies',{'time': timex} , {maxAge: 900000, httpsOnly: true});
    }
    else {

    }
    res.send('Hello Secure World! Cookies: ' + JSON.stringify(req.cookies) +
        'User-Agent: ' + req.headers['user-agent'] + ' User IP-Adress: ' + req.connection.remoteAddress);
});*/

//app route juttu
/*app.route('/user/:query/:name')
    .get((req, res, next) => {
    console.log(req.params.query)
    const foundUser = users.filter((user) => {
        console.log(user.name);
        if(req.params.query == user.id){
            console.log('found user with same id');
            return user;
        }
    });
        res.send('Get a user: ' + foundUser[0].name);
        next();
    })
    .post((req, res, next) => {
    console.log('Arrived at post with obj: ');
    console.log(req.params.query);
    users.push({id: users.length, name: req.params.query});
        res.send('Added a user: ' + req.params.query);
        next();
    })
    .put((req, res, next) => {
        users = users.map((user) => {
            console.log(user.name);
            if(req.params.query == user.id){
                console.log('found user with same id: ' + user.name);
                user.name = req.params.name;

                console.log('new user name: ' + user.name);
                return user;
            }
        });
        res.send('Update the user')
        next();
    })
    .delete((req, res, next) => {
    console.log('hit delete spot, first guys name: ' + users[0].name);
    users = users.filter((user) => {
        if (user.id != req.params.query){
            return user;
        }
    });
    console.log('Deleted succesfully? Here is the first guys name: ' + users[0].name)
        res.send('Deleted the user!')
        next();
    });

app.use('/user/:query/:name', (req, res, next) => {
    const timex = moment().format('MMMM Do YYYY, h:mm a');
    console.log('Timestamp: ' + timex);
    console.log('Requested path: ' + req.route.path);
    console.log('IP-address: ' + req.connection.remoteAddress);
    console.log('User Agent: ' + req.headers['user-agent']);
    console.log('Browser: ' + req.browser);
});

app.use(function (err, req, res, next) {
    res.status(500).send('Error bad query');
    saveError(err);
});

*/
/*
https.createServer(options, app).listen(3000);


http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);
*/

/*mongoose.connect('mongodb://myTester:xyz123@localhost:27017/test').then(() => {
    console.log('Connected successfully.');
    app.use(express.static('public'));
}, err => {
    console.log('Connection to db failed: ' + err);
});*/

const Schema = mongoose.Schema;

const exCatSchema = new Schema({
    name: { type: String, default: 'someCat' },
    age: String,
    gender: String,
    weight: String
});

const ExCat = mongoose.model('ExCat', exCatSchema);

//exCat.create({name: 'derpy', age: '8', gender: 'male', weight: '12'})

app.set('view engine', 'pug');

const updateDb = (obj) => {
        ExCat.update({ _id: obj.id}, { $set: { name: obj.name }}, (err) => {
            if (!err){
                console.log('Updated name to ' + obj.name );
            }
            else{
                throw err;
            }
        });
}

const removeFromDb = (id) => {
        ExCat.remove({_id: id}, (err) => {
            if(!err){
                console.log('Deleted!');
            }
            else {
                console.log(err);
            }
        });
}
const getExCats = () => {
    const promise = ExCat.find().exec();
    return promise;
}



const saveError = (d) => {
        log_file.write((d) + '\n');
        log_stdout.write((d) + '\n');
}

/*ExCat.find().exec().then((exCats) => {
    console.log("Got " + exCats.length + " cats!");
    app.get('/', function (req, res) {
        res.render('index', {title: 'Hey', message: 'Hello there!', cats: exCats})
    });
});*/


app.listen(3000);

