'use strict';

// var bcrypt = require('bcrypt');
var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
// var _ = require('lodash');

class Task {
  static create(userId, obj, fn){
    var task = new Task();
    task.title = obj.title;
    task.due = new Date(obj.due);
    task.color = obj.color;
    task.isComplete = false;
    task.userId = Mongo.ObjectID(userId);

    tasks.save(task, (e,t)=>{
      fn(t);
    });
  }

}

module.exports = Task;
