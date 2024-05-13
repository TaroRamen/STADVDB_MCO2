const Handlebars = require('handlebars');
const express = require("express");
const searchRouter = express.Router();

const appModel = require("../models/appointments");

searchRouter.post('/search-insert-post', function(req, resp){
    var searchData = {
        patientid: req.body.patientid,
        doctorid: req.body.doctorid,
        clinicid: req.body.clinicid,
        clinicregion: req.body.clinicregion,
        appstatus: req.body.appstatus,
        timequeued: req.body.timequeued,
        queuedate: req.body.queuedate,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        apptype: req.body.apptype,
        isvirtual: req.body.isvirtual,
        apptid : req.body.apptid // assuming apptid is last in the SQL table
    }
    req.session.searchData = searchData
    resp.send({
        terminal : 0
    });
});

searchRouter.post('/search-view-post', function(req, resp){
    resp.send({
        terminal : 0
    });
});

searchRouter.get('/search-insert', function(req, resp){
    resp.render('search-insert',{
        layout: 'index',
        title: 'Search Database',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2
    });
});

searchRouter.get('/search-view', async function(req, resp){

    var apps = await appModel.searchApp(req.session.searchData, req.session.crashMain || req.session.crashSlave1, req.session.crashMain || req.session.crashSlave2);

    resp.render('search-view',{
        layout: 'index',
        title: 'Search Database',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2,
        apps: apps
    });
});


module.exports = searchRouter;
