/**
 * Created by cenkce on 12/15/15.
 */

'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();
var api = express();

var data = [
    {
        changeList:'432464',
        owner:'JTuck',
        status:'running',
        date:'4 / 17 / 2014',
        time:'9:42 am',
        steps: [
                {status:'pending', percent:'100'}
            ],
        build:{}
    },
    {
        changeList:'432463',
        owner:'Dora',
        status:'pending',
        date:'4 / 17 / 2014',
        time:'7:40 am',
        steps: [
                {status:'pending', percent:'100', time:''}
            ],
        build:{}
    },
    {
        changeList:'432462',
        owner:'Samy',
        status:'pass',
        date:'4 / 17 / 2014',
        time:'6:42 am',
        steps: [
                {status:'pending', percent:'100', time:''}
            ],
        build:{
            time:'',
            debug:{
                status:'pass',
                logUrl:''
            },
            release:{
                status:'fail',
                logUrl:''
            },
            tests:[
                {
                    name:'Unit Test',
                    percent:0,
                    status:'fail',
                    timeElapsed:'',
                    passCount:0,
                    warningCount:0,
                    statusMessage:'Can\'t Run'
                },
                {
                    name:'Functional Test',
                    percent:0,
                    status:'fail',
                    timeElapsed:'',
                    passCount:0,
                    warningCount:0,
                    statusMessage:'Can\'t Run'
                }
            ]
        }
    },
    {
        changeList:'432462',
        owner:'JTuck',
        status:'fail',
        date:'4 / 17 / 2014',
        time:'6:42 am',
        steps: [
                {status:'pending', percent:'100', time:''}
            ],
        build:{
            time:'',
            debug:{
                status:'pass',
                logUrl:''
            },
            release:{
                status:'pass',
                logUrl:''
            },
            tests:[
                {
                    name:'Unit Test',
                    percent:88,
                    status:'pass',
                    timeElapsed:'4.30',
                    passCount:342,
                    warningCount:3,
                    statusMessage:''
                },
                {
                    name:'Functional Test',
                    percent:98,
                    status:'pass',
                    timeElapsed:'3.30',
                    passCount:14321,
                    warningCount:2000,
                    statusMessage:''
                }
            ]
        }
    },
    {
        changeList:'432462',
        owner:'Samy',
        status:'pass',
        date:'4 / 17 / 2014',
        time:'6:42 am',
        steps: [
            {status:'pending', percent:'100', time:''}
        ],
        build:{
            time:'',
            debug:{
                status:'pass',
                logUrl:''
            },
            release:{
                status:'fail',
                logUrl:''
            },
            tests:[
                {
                    name:'Unit Test',
                    percent:0,
                    status:'fail',
                    timeElapsed:'',
                    passCount:0,
                    warningCount:0,
                    statusMessage:'Can\'t Run'
                },
                {
                    name:'Functional Test',
                    percent:0,
                    status:'fail',
                    timeElapsed:'',
                    passCount:0,
                    warningCount:0,
                    statusMessage:'Can\'t Run'
                }
            ]
        }
    },
    {
        changeList:'432462',
        owner:'Dora',
        status:'fail',
        date:'4 / 17 / 2014',
        time:'6:42 am',
        steps: [
            {status:'pending', percent:'100', time:''}
        ],
        build:{
            time:'',
            debug:{
                status:'pass',
                logUrl:''
            },
            release:{
                status:'pass',
                logUrl:''
            },
            tests:[
                {
                    name:'Unit Test',
                    percent:88,
                    status:'pass',
                    timeElapsed:'4.30',
                    passCount:342,
                    warningCount:3,
                    statusMessage:''
                },
                {
                    name:'Functional Test',
                    percent:98,
                    status:'pass',
                    timeElapsed:'3.30',
                    passCount:14321,
                    warningCount:2000,
                    statusMessage:''
                }
            ]
        }
    }
];

app.use(express.static('./'));

api.get('/projects', function(req, res) {
    res.json(data);
});

app.use('/api', api);

app.listen(5000);
