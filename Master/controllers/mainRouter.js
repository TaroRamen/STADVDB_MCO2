const Handlebars = require('handlebars');
const express = require("express");
const mainRouter = express.Router();

const sql = require('../sql');

const appModel = require("../models/appointments");

mainRouter.get('/', function(req, resp){

    if(req.session.crashMain){
        
    }
    else{
        req.session.crashMain = 'false'
    }

    if(req.session.crashSlave1){
        
    }
    else{
        req.session.crashSlave1 = 'false'
    }

    if(req.session.crashSlave2){
        
    }
    else{
        req.session.crashSlave2 = 'false'
    }

    resp.render('main',{
        layout: 'index',
        title: 'Home Page',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2
    });

});

mainRouter.post('/crash-main', async function(req, resp){

    var recoveryResults

    if(req.body.crash === 'false'){
        sql.masterCrash(sql.readLuzon, sql.writeLuzon, sql.readVisMin, sql.writeVisMin);
        recoveryResults = 'none'
        req.session.crashMain = 'true'
    }
    else{
        recoveryResults = await sql.masterRecover(sql.readLuzon, sql.writeLuzon, sql.readVisMin, sql.writeVisMin);
        req.session.crashMain = 'false'
    }

    resp.send({
        crash: req.body.crash,
        recoveryResults : recoveryResults
    })
});

mainRouter.post('/crash-slave1', async function(req, resp){

    var recoveryResults

    if(req.body.crash === 'false'){
        await sql.slave1Crash(sql.writeLuzon);
        recoveryResults = 'none'
        req.session.crashSlave1 = 'true'
    }
    else{
        recoveryResults = await sql.slave1Recover(sql.writeLuzon);
        req.session.crashSlave1 = 'false'
    }

    resp.send({
        crash: req.body.crash,
        recoveryResults : recoveryResults
    })
});

mainRouter.post('/crash-slave2', async function(req, resp){

    var recoveryResults

    if(req.body.crash === 'false'){
        await sql.slave2Crash(sql.writeVisMin);
        recoveryResults = 'none'
        req.session.crashSlave2 = 'true'
    }
    else{
        recoveryResults = await sql.slave2Recover(sql.writeVisMin);
        req.session.crashSlave2 = 'false'
    }

    resp.send({
        crash: req.body.crash,
        recoveryResults : recoveryResults
    })
});

const insertRouter = require('./insertRouter');
mainRouter.use('/', insertRouter);

const updateRouter = require('./updateRouter');
mainRouter.use('/', updateRouter);

const searchRouter = require('./searchRouter');
mainRouter.use('/', searchRouter);

const viewRouter = require('./viewRouter');
mainRouter.use('/', viewRouter);

module.exports = mainRouter
