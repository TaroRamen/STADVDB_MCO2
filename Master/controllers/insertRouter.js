const Handlebars = require('handlebars');
const express = require("express");
const insertRouter = express.Router();

const appModel = require("../models/appointments");

insertRouter.get('/insert', function(req, resp){
    resp.render('insert',{
        layout: 'index',
        title: 'Insert Data',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2
    });
});

insertRouter.post('/insert-post', async function(req, resp){
    var count = await appModel.getCountApps(req.session.crashMain || req.session.crashSlave1 || req.session.crashSlave2);

    if(req.session.crashSlave1 === 'true' || req.session.crashSlave2 === 'true'){
        count += 1
    }

    var data = {
        patientid: req.body.patientid,
        clinicid: req.body.clinicid,
        doctorid: req.body.doctorid,
        apptid: count + 3444444,
        appstatus: req.body.appstatus,
        timequeued: req.body.timequeued,
        queuedate: req.body.queuedate,
        starttime: req.body.starttime,
        endtime: req.body.endtime,
        apptype: req.body.apptype,
        isvirtual: req.body.isvirtual,
        clinicregion: req.body.clinicregion
    }

    var result = await appModel.insertApp(data, req.session.crashMain, req.session.crashSlave1, req.session.crashSlave2);
    
    resp.send({
        result : result,
        terminal : 0
    });
});

module.exports = insertRouter;
