/**
 * Created by Teemu on 11.4.2017.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const log_file = fs.createWriteStream('./debug.log', {flags : 'w'});
const log_stdout = process.stdout;
const moment = require('moment');


const saveError = (d) => {
    log_file.write((d) + '\n');
    log_stdout.write((d) + '\n');
}

router.use('/:query/:name', (req, res, next) => {
    const timex = moment().format('MMMM Do YYYY, h:mm a');
    console.log('Timestamp: ' + timex);
    console.log('Requested path: ' + req.route.path);
    console.log('IP-address: ' + req.connection.remoteAddress);
    console.log('User Agent: ' + req.headers['user-agent']);
    console.log('Browser: ' + req.browser);
});

router.use((err, req, res, next) => {
    res.status(500).send('Error bad query');
    saveError(err);
});

module.exports = router;
