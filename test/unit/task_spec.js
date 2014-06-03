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
var greg;
var garbage;
var bank;

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
        User.register({email: 'sue@sue.com', password: '1234'}, function(user){
          sue = user;
          User.register({email: 'greg@greg.com', password: 'abcd'}, function(user2){
            greg = user2;
            Task.create(sue._id, {title: 'dishes', due:'2014-05-13', color: 'blue'}, function(task){
              dishes = task;
              Task.create(sue._id, {title: 'garbage', due:'2014-05-13', color: 'blue'}, function(task2){
                garbage = task2;
                Task.create(greg._id, {title: 'go to bank', due:'2014-05-13', color: 'blue'}, function(task3){
                  bank = task3;
                });
              });
              done();
            });
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
        expect(t).to.be.instanceof(Task);
        expect(t._id).to.deep.equal(dishes._id);
      });
    done();
    });

    it('should NOT successfully return a task - wrong ID', function(done){
      Task.findById('123456789098765432112345', function(t){
        expect(t).to.be.null;
        done();
      });
    });

    it('should NOT successfully return a task - not an Id', function(done){
      Task.findById('not an id', function(t){
        expect(t).to.be.null;
        done();
      });
    });

  });

  describe('.findByUserId', function(){
    it('should find all tasks with entered userId', function(done){
      Task.findByUserId(sue._id.toString(), function(tasks){
        expect(tasks).to.have.length(2);
        expect(tasks[0].userId).to.deep.equal(sue._id);
      });
      done();
    });

    it('should NOT find any tasks - bad userId', function(done){
      Task.findByUserId('not an id', function(tasks){
        expect(tasks).to.be.null;
      });
      done();
    });

    it('should NOT find any tasks - wrong user Id', function(done){
      Task.findByUserId('362745362830193627384234', function(tasks){
        expect(tasks).to.have.length(0);
      });
      done();
    });

  });

  describe('#destroy', function(){
    it('should find and delete task', function(done){
      dishes.destroy(function(){
        Task.findByUserId(sue._id.toString(), function(tasks){
          expect(tasks).to.have.length(1);
        });
      });
      done();
    });
  });

  describe('#toggleComplete', function(){
    it('should toggle complete to true', function(){
      dishes.toggleComplete();
      expect(dishes.isComplete).to.be.true;
    });
  });

  describe('#save', function(){
    it('should save task', function(done){
      dishes.toggleComplete();
      dishes.save(function(){
        Task.findById(dishes._id.toString(), function(foundTask){
          expect(foundTask.isComplete).to.be.true;
        });
      });
      done();
    });
  });



});
