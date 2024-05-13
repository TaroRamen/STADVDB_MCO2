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

    if(req.session.crashSlave){
        
    }
    else{
        req.session.crashSlave = 'false'
    }

    resp.render('main',{
        layout: 'index',
        title: 'Home Page',
        crashMain : req.session.crashMain,
        crashSlave : req.session.crashSlave
    });

});

mainRouter.post('/crash-main', async function(req, resp){

    var recoveryResults

    if(req.body.crash === 'false'){
        sql.masterCrash(sql.write);
        recoveryResults = 'none'
        req.session.crashMain = 'true'
    }
    else{
        recoveryResults = await sql.masterRecover(sql.read, sql.write);
        req.session.crashMain = 'false'
    }

    resp.send({
        crash: req.body.crash,
        recoveryResults : recoveryResults
    })
});

mainRouter.post('/crash-slave', async function(req, resp){

    var recoveryResults

    if(req.body.crash === 'false'){
        await sql.slaveCrash(sql.read, sql.write);
        recoveryResults = 'none'
        req.session.crashSlave = 'true'
    }
    else{
        recoveryResults = await sql.slaveRecover(sql.read, sql.write);
        req.session.crashSlave = 'false'
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
