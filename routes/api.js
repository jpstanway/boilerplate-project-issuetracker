/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) { 
  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      
    })
    .post(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) res.send('Failed to connect to database');
        
        db.collection(project).insert({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || 'Chai and Mocha',
          status_text: req.body.status_text || 'In QA',
          created_on: Date.now(),
          updated_on: Date.now()
        }, function(err, result) {
          if (err) res.send('Failed to log issue to database');

          res.json(result.ops);
        });
      });
    })
    .put(function (req, res){
      var project = req.params.project;
      
    })
    .delete(function (req, res){
      var project = req.params.project;
      
    }
  );
};
