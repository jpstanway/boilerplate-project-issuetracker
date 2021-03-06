/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let deleteIssue;

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.body[0].issue_title);
          assert.isOk(res.body[0].issue_text);
          assert.isOk(res.body[0].created_by);
          assert.isOk(res.body[0].assigned_to);
          assert.isOk(res.body[0].status_text);
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Delete me',
            issue_text: 'this will be deleted later',
            created_by: 'Functional Test - Required fields filled in'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isOk(res.body[0].issue_title);
            assert.isOk(res.body[0].issue_text);
            assert.isOk(res.body[0].created_by);
            deleteIssue = res.body[0]._id;
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: '',
            issue_text: '',
            created_by: ''
          })
          .end(function(err, res) {
            assert.isNotNull(err, 'Required fields missing');
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no updated field sent');
            done();
          });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: '5c11aa7ea134393ff485b6f6',
            issue_title: 'one field - Updated'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'successfully updated 5c11aa7ea134393ff485b6f6');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: '5c11ab00a865e7074496231b',
            issue_title: 'multiple fields - Updated',
            issue_text: 'Functional test - Multiple fields to update',
            created_by: 'John',
            assigned_to: 'Sam',
            status_text: 'Under review'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'successfully updated 5c11ab00a865e7074496231b');
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({issue_title: 'Title'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'Title');
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({
            issue_title: 'Title',
            issue_text: 'text',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body[0].issue_title, 'Title');
            assert.equal(res.body[0].issue_text, 'text');
            assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
            assert.equal(res.body[0].status_text, 'In QA');
            done();
          });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, '_id error');
            done();
          });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: deleteIssue})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'deleted ' + deleteIssue);
            done();
          });
      });
      
    });

});
