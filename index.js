"use strict";

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const user = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;

mongoose.Promise = global.Promise; //ES6 Promise
mongoose.connect('mongodb://'+ user +':' + pw +'@'+ host).then(() => {
    console.log('Connected successfully.');
    app.listen(3000);
    app.use(express.static('public'));
}, err => {
    console.log('Connection to db failed: ' + err);
});

app.get('/cats', (req, resp) => {
    Cat.find().exec().then((cats) => {
        resp.send(cats);
    })
});

app.post('/newCat', (req, resp) => {
    Cat.create(req.bodyg);
    console.log('cat added with name: ' + req.body.name);
});


const Schema = mongoose.Schema;

const catSchema = new Schema({
    name: { type: String, default: 'someCat' },
    time: { type: String, default: this.date},
    gender: String,
    color: String,
    weight: Number
});

const Cat = mongoose.model('Cat', catSchema);

/* Cat.create({age: 8, gender: 'female', color: 'dark', weight: 8}).then(post => {
    console.log(post.name);
});
*/

Cat.find().exec().then((cats) => {
    console.log("Got " + cats.length + " cats!");
});