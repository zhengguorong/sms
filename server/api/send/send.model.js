'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SendSchema = new Schema({
  userId: String,//发送用户id
  templateId: String,//发送模板编号
  content: String,//发送内容
  mobilePhone:String,//发送手机
  number:String,//货架编号
  code:String,//发送状态
  msg:String,//发送状态说明
  updated: { type: Date, default: Date.now }//发送时间
});

module.exports = mongoose.model('Send', SendSchema);
