"use strict";


const express = require('express');
const path = require('path');
const multer = require('multer');
const ExifImage = require('exif').ExifImage;
const DB = require('./modules/database');
const thumbnail = require('./modules/thumbnail');
const dotenv = require('dotenv').config();

const app = express();


const user = process.env.DB_USER;
const pw = process.env.DB_PASS;
const host = process.env.DB_HOST;
// set up database
// DB.connect('mongodb://alakerta:q1w2e3r4@localhost/alakerta', app);
DB.connect('mongodb://' + user + ':'+ pw +'@' + host, app);
const spySchema = {
    time: Date,
    category: String,
    title: String,
    details: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    thumbnail: String,
    image: String,
    original: String
};

const Spy = DB.getSchema(spySchema, 'Spy');


// set up file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/original')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
});
const upload = multer({storage: storage});


// serve files
app.use(express.static('files'));

app.use('/modules', express.static('node_modules'));

app.use('/docs', express.static('docs'));

// get posts
app.get('/posts', (req, res) => {
    getSpys().then((posts) => {
        res.send(posts);
    });
});

// get search posts
app.get('/posts/:search', (req, res) => {
    getSpys(req.params.search).exec((err, result) => {
        res.send(result);
    });
});


app.delete('/delete', upload.single('file'), (req, res) => {
    removeFromDb(req.body, res);
});

// update object in database, first receive post and create image
app.patch('/update', upload.single('file'), (req, res, next) => {
    if (req.file != null) {
        const file = req.file;
        req.body.thumbnail = 'thumb/' + file.filename;
        req.body.image = 'img/' + file.filename;
        req.body.original = 'original/' + file.filename;
    }
    req.body.time = new Date().getTime();
    req.body.coordinates = {
        lat: 60.2196781,
        lng: 24.8079786
    };
    next();
});

// creating thumbnails and shiz
app.use('/update', (req, res, next) => {
    if (req.file != null){
        const small = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.thumbnail, 300, 300);
        if( typeof small === 'object'){
            res.send(small);
        }
        const medium = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.image, 720, 480);
        if( typeof medium === 'object'){
            res.send(medium);
        }
    }
    next();
});

// updating the database with req body object.
app.use('/update', (req, res, next) => {
    // console.log(req.body);
    updateDb(req.body, res);
});

// add new *************
// get form data and create object for database (=req.body)
app.post('/new', upload.single('file'), (req, res, next) => {
    const file = req.file;
    req.body.thumbnail = 'thumb/' + file.filename;
    req.body.image = 'img/' + file.filename;
    req.body.original = 'original/' + file.filename;
    req.body.time = new Date().getTime();
    // get EXIF data
    try {
        req.body.coordinates = { lat: 60.3196781, lng: 24.9079786};
        next();       
    } catch (error) {
        console.log('Error: ' + error.message);
        res.send({status: 'error', message: 'EXIF error'});
    }
});

// create thumbnails
app.use('/new', (req, res, next) => {
    const small = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.thumbnail, 300, 300);
    if( typeof small === 'object'){
        res.send(small);
    }
    const medium = thumbnail.getThumbnail('files/'+req.body.original, 'files/'+req.body.image, 720, 480);
    if( typeof medium === 'object'){
        res.send(medium);
    }
    next();
});

// add to DB
app.use('/new', (req, res, next) => {
    // console.log(req.body);
    Spy.create(req.body).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });
});
// end add new ******************

// convert GPS coordinates to GoogleMaps format
const gpsToDecimal = (gpsData, hem) => {
    let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) + parseFloat(gpsData[2] / 3600);
    return (hem === 'S' || hem === 'W') ? d *= -1 : d;
}




// SOME ESSENTIAL FUNCTIONS

const updateDb = (obj, res) => {
    console.log(obj._id);
    Spy.update(
        {_id  : obj._id},
        {$set: obj}
    ).then(post => {
        res.send({status: 'OK', post: post});
    }).then(() => {
        res.send({status: 'error', message: 'Database error'});
    });
}

const removeFromDb = (obj,res) => {
        Spy.remove({_id: obj._id}, (err) => {
            if(!err){
                console.log('Deleted!');
            }
            else {
                console.log(err);
            }
        }).then(post => {
            res.send({status: 'OK', post: post});
        }).then(() => {
            res.send({status: 'error', message: 'Database error'});
        });
}

const getSpys = (params) => {
    if(params != null){
        const p = new RegExp(params, 'i');
        const promise = Spy.find().or([{'title': { $regex: p}}, {'details': { $regex: p}}, {'category' : { $regex: p}}]);
        return promise;
    }
    else {
        const promise = Spy.find().exec();
        return promise;   
    }
}