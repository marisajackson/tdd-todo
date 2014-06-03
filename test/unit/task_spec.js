/* global before, describe, it, beforeEach*/
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
// var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var moment = require('moment');


var User;
var Task;
var dishes;
var sue;

describe('Task', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      Task = traceur.require(__dirname + '/../../app/models/task.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      global.nss.db.collection('tasks').drop(function(){
        Task.create(sue._id, {title: 'dishes', due:'2014-05-13', color: 'blue'}, function(task){
            User.register({email: 'sue@sue.com', password: '1234'}, function(user){
            sue = user;
            dishes = task;
            done();
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should create a new task w/ string id', function(done){
      Task.create(sue._id.toString(), {title: 'laundry', due:'2014-05-13', color: 'blue'}, function(task){
        expect(task).to.be.instanceof(Task);
        expect(task).to.be.ok;
        expect(task.title).to.equal('laundry');
        expect(moment(task.due).format('YYYY-MM')).to.equal('2014-05');
        expect(task.color).to.equal('blue');
        expect(task.isComplete).to.be.false;
        expect(task.userId).to.deep.equal(sue._id);
      });
      done();
    });

    it('should create a new task w/ object id', function(done){
      Task.create(sue._id, {title: 'laundry', due:'2014-05-13', color: 'blue'}, function(task){
        expect(task).to.be.instanceof(Task);
        expect(task._id).to.be.ok;
      });
      done();
    });

  });
  describe('.findById', function(){
    it('should return a task with good id', function(done){
      Task.findById(dishes._id.toString(), function(t){
        expect(t.title).to.equal(dishes.title);
        // expect()
      });
    });
  });

});
