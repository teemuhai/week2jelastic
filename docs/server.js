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

/**
 * @api {get} /posts/:search Search for an object from the database
 * @apiName Search get
 * @apiGroup Gets
 * @apiDescription Search Search for objects from the database with requirements
 * @apiParam {JSON} FormData A form data object with the search parameters as requirements.params.search
 *
 * @apiSuccess {JSON} send Send response with status 'OK' and post that includes search results from the database
 *
 */

app.get('/posts/:search', (req, res) => {
    getSpys(req.params.search).exec((err, result) => {
        res.send(result);
    });
});

/**
 * @api {delete} /delete deleting an existing object from database
 * @apiName Delete delete
 * @apiGroup Deletes
 * @apiDescription Delete existing object's data from the database
 * @apiParam {JSON} FormData A form data with the object ID that you want to delete from the database
 *
 * @apiSuccess {JSON} send Object is deleted from database and will send response with status 'OK' and post
 *
 */
app.delete('/delete', upload.single('file'), (req, res) => {
    console.log(req.body);
    removeFromDb(req.body,res);
});



/**
 * @api {get} /posts Get all the Spy objects from the database
 * @apiName GetAll get
 * @apiGroup Gets
 * @apiDescription Get get all existing objects from the database
 * @apiParam {JSON} FormData A form data with the requirements to get all items from database
 *
 * @apiSuccess {JSON} send Get objects from the database with find from the database and send a response with status 'OK' and post that includes the data gotten from the database
 *
 */
// get posts
app.get('/posts', (req, res) => {
    getSpys().then((posts) => {
        res.send(posts);
    });
});

/**
 * @api {patch} /update Update an existing object in database
 * @apiName Update patch
 * @apiGroup Patches
 * @apiDescription Change existing object's data within the database and save it
 * @apiParam {JSON} FormData A form data with the object that you want to update/edit
 *
 * @apiSuccess {JSON} send Object is updated in database and will send response with status 'OK' and post
 * 
 */


// update object in database, first receive post and create image
app.post('/update', upload.single('file'), (req, res, next) => {
    const file = req.file;
    req.body.thumbnail = 'thumb/' + file.filename;
    req.body.image = 'img/' + file.filename;
    req.body.original = 'original/' + file.filename;
    req.body.time = new Date().getTime();
    req.body.coordinates = { lat: 60.3196781, lng: 24.9079786};
        next(); 
});

// creating thumbnails and shiz
app.use('/update', (req, res, next) => {
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

// updating the database with req body object.
app.use('/update', (req, res, next) => {
    // console.log(req.body);
    updateDb(req.body);
    console.log('Here lies req.body: ');
    console.log(req.body);
    getSpys().then((posts) => {
        res.send({status: 'OK', post: posts});
    });
});

// add new *************
// get form data and create object for database (=req.body)

/**
 * @api {post} /new adding a post to database
 * @apiName Add new
 * @apiGroup Posts
 * @apiDescription Create new objects into the database based on received form data
 * @apiParam {JSON} FormData A form data object submitted from the front end
 *
 * @apiSuccess {JSON} send Sends response with status 'OK' and post
 * 
 */

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
};

// SOME ESSENTIAL FUNCTIONS

const updateDb = (obj) => {
    console.log(obj._id);
    Spy.update({ _id: obj._id},
        { $set:
            {title: obj.title,
                details: obj.details,
                category: obj.category,
                image: obj.image,
                thumbnail: obj.thumbnail,
                original: obj.original}
        }, (err) => {
            if (!err){
                console.log('Updated name to ' + obj.title );
            }
            else{
                throw err;
            }
        });
}

const removeFromDb = (obj,res) => {
    Spy.remove({_id: obj._id}, (err) => {
        if(!err){
            console.log('Deleted: ' + obj.title + '!');
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