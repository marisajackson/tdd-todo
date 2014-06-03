/* global before, describe, it, beforeEach */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'todo-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../app/app');
var request = require('supertest');
var traceur = require('traceur');

var User;

var sue;

describe('User', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      User = traceur.require(__dirname + '/../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      User.register({email: 'sue@sue.com', password: '1234'}, function(user){
        sue = user;
        done();
      });
    });
  });

  describe('.register', function(){
    it('should successfully register a user', function(done){
      var obj = {email: 'marisa@marisa.com', password: '1234'};
      User.register(obj, function(u){
        expect(u).to.be.ok;
        expect(u).to.be.an.instanceof(User);
        expect(u.password).to.have.length(60);
        expect(u._id).to.be.an.instanceof(Mongo.ObjectID);
        done();
      });
    });


    it('should NOT successfully register a user', function(done){
      var obj = {email: 'sue@sue.com', password: '1234'};
      User.register(obj, function(u){
        expect(u).to.be.null;
        done();
      });
    });

  });

  describe('.login', function(){
    it('should login a user', function(done){
      User.login({email: 'sue@sue.com', password:'1234'}, function(u){
        expect(u).to.be.ok;
        done();
      });
    });

    it('should NOT login user - bad email', function(done){
      User.login({email: 'wrong@email.com', password:'1234'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

    it('should NOT login user - bad password', function(done){
      User.login({email: 'sue@sue.com', password:'wrong'}, function(u){
        expect(u).to.be.null;
        done();
      });
    });

  });

  describe('.findByUserId', function(){
    it('should return correct user object', function(done){
      User.findByUserId(sue._id.toString(), function(user){
        expect(user).to.be.instanceof(User);
        expect(user.email).to.equal(sue.email);
        expect(user._id.toString()).to.equal(sue._id.toString());
        done();
      });
    });

    it('should return null for bad userId', function(done){
      User.findByUserId('wrong', function(user){
        expect(user).to.be.null;
        done();
      });
    });


    
  });

});
