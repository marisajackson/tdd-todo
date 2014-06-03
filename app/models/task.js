'use strict';

var tasks = global.nss.db.collection('tasks');
var Mongo = require('mongodb');
var _ = require('lodash');

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

  static findById(taskId, fn){
    if(taskId.length !== 24){fn(null); return;}
    taskId = Mongo.ObjectID(taskId);
    tasks.findOne({_id:taskId}, (err, task)=>{
      if(task){
        task = _.create(Task.prototype, task);
        fn(task);
      } else {
        fn(null);
      }
    });
  }

  static findByUserId(userId, fn){
    if(userId.length !== 24){fn(null); return;}
    userId = Mongo.ObjectID(userId);
    tasks.find({userId:userId}).toArray((err,records)=>{
      fn(records);
    });
  }

  destroy(fn){
    tasks.findAndRemove({_id: this._id}, ()=>{
      fn();
    });
  }

  toggleComplete(){
    this.isComplete = !this.isComplete;
  }

  save(fn){
    tasks.save(this,()=>fn());
  }
}

module.exports = Task;
