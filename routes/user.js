/**
 * Created by Teemu on 11.4.2017.
 */

"use strict";

const express = require('express');
const router = express.Router();

let users = [{id: 0, name: 'Liza'},{id: 1, name : 'Carl'}];




router.get('/', (req, res) => {
    res.send(users);
});

router.route('/:query/:name')
    .get((req, res, next) => {
        console.log(req.params.query)
        const foundUser = users.filter((user) => {
            console.log(user.name);
            if(req.params.query == user.id){
                console.log('found user with same id');
                return user;
            }
        });
        res.send('Get a user: ');
        console.log(' I done the get')
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




module.exports = router;
