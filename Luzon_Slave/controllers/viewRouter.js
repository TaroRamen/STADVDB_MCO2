
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
        crashSlave : req.session.crashSlave
    });
});


viewRouter.get('/view-view', async function(req, resp){

    var reports = await appModel.reportApp(req.session.query, req.session.crashMain || req.session.crashSlave);

    resp.render('view-view',{
        layout: 'index',
        title: 'View Reports',
        crashMain : req.session.crashMain,
        crashSlave : req.session.crashSlave,
        reports: reports
    });
});



module.exports = viewRouter;
