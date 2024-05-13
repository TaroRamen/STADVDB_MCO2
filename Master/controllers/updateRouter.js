
const Handlebars = require('handlebars');
const express = require("express");
const updateRouter = express.Router();

const appModel = require("../models/appointments");

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('formatDateTime', function(dateTimeString) {

    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });

updateRouter.post('/update-search-post', function(req, resp){
    req.session.apptid = req.body.apptid;

    resp.send({
        terminal : 0
    });
});

updateRouter.post('/update-insert-post', async function(req, resp){
    var data = {
        apptid : req.body.apptid,
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
        isvirtual: req.body.isvirtual
    }

    var result = await appModel.updateApp(data, req.session.crashMain, req.session.crashSlave1, req.session.crashSlave2);
    
    resp.send({
        result : result,
        terminal : 0
    });
});

updateRouter.get('/update-search', function(req, resp){
    resp.render('update-search',{
        layout: 'index',
        title: 'Update Data',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2
    });
});

updateRouter.get('/update-insert', async function(req, resp){
    var data = await appModel.getAppById(req.session.apptid)

    console.log(data)
    resp.render('update-insert',{
        layout: 'index',
        title: 'Update Data',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2,
        app: data[0]
    });
});

module.exports = updateRouter;