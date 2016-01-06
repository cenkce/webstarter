/**
 * Created by cenkce on 12/15/15.
 */

'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();
var api = express();

var data = ['Hello World'];

app.use(express.static('./'));

api.get('/projects', function(req, res) {
    res.json(data);
});

app.use('/api', api);

app.listen(5000);
