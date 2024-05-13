
const Handlebars = require('handlebars');
const express = require("express");
const viewRouter = express.Router();

const appModel = require("../models/appointments");

viewRouter.post('/view-search-post', function(req, resp){
    req.session.query = req.body.query
    resp.send({
        terminal : 0
    });
});

viewRouter.post('/view-view-post', function(req, resp){
    resp.send({
        terminal : 0
    });
});

viewRouter.get('/view-search', function(req, resp){
    resp.render('view-search',{
        layout: 'index',
        title: 'View Reports',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2
    });
});


viewRouter.get('/view-view', async function(req, resp){

    var reports = await appModel.reportApp(req.session.query);

    resp.render('view-view',{
        layout: 'index',
        title: 'View Reports',
        crashMain : req.session.crashMain,
        crashSlave1 : req.session.crashSlave1,
        crashSlave2 : req.session.crashSlave2,
        reports: reports
    });
});



module.exports = viewRouter;
