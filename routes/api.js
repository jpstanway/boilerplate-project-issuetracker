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
          _id: ObjectId(),
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || 'Chai and Mocha',
          open: true,
          status_text: req.body.status_text || 'In QA',
        }, function(err, result) {
          if (err) res.json('Failed to log issue to database');

          res.json(result.ops);
          db.close();
        });
      });
    })
    .put(function (req, res){
      var project = req.params.project;
    
      const updateObject = {}; // initialize update object with current time

      // loop through form fields and only assign what has a value
      for (let field in req.body) {
        if (field && field !== '_id' && req.body[field].length > 0) {
          updateObject[field] = req.body[field];
        }
      }

      // send error message if object is empty, or add updated_on field
      if (Object.keys(updateObject).length === 0) {
        res.json('no updated field sent');
      } else {
        updateObject['updated_on'] = new Date();
      }

      // connect to database and update document based on id
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if(err) res.json('Failed to connect to database');

        db.collection(project).findAndModify(
          { _id: ObjectId(req.body._id) }, // query
          {}, // sort
          { $set: updateObject }, // update document with update object
          { new: true }, // update and return modified document
          (err, result) => {
            if (err) res.json('could not update' + req.body._id);

            res.json('successfully updated ' + req.body._id);
            db.close();
          }
        );
      });
      
    })
    .delete(function (req, res){
      var project = req.params.project;
      
      // connect to database and delete by _id
      MongoClient.connect(CONNECTION_STRING, (err, db) => {
        if (err) res.json('Failed to connect to database');

        db.collection(project).findOneAndDelete(
          { _id: ObjectId(req.body._id) }, // document to delete
          (err, result) => {
            
            if (err) {
              res.json('could not delete ' + req.body._id);
            } else if (result.value) {
              res.json('deleted ' + req.body._id);
            } else {
              res.json('_id error');
            }
  
          }
        );
      });
    }
  );
};
