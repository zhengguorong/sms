'use strict';

var _ = require('lodash');
var Send = require('./send.model');
var SendService=require('../../sms/message/send.service');

// Get list of sends
exports.index = function(req, res) {
  Send.find(function (err, sends) {
    if(err) { return handleError(res, err); }
    return res.json(200, sends);
  });
};
exports.getByUserId=function(req,res){
  Send.find({userId:req.user["_id"]},function(err,sends){
    if(err) { return handleError(res, err); }
    return res.json(200, sends);
  })
}
// Get a single send
exports.show = function(req, res) {
  Send.findById(req.params.id, function (err, send) {
    if(err) { return handleError(res, err); }
    if(!send) { return res.send(404); }
    return res.json(send);
  });
};

// Creates a new send in the DB.
exports.create = function(req, res) {
  for(var i=0;i<req.body.length;i++){
    var ele=req.body[i];
    ele.userId=req.user["_id"];
    SendService.sendMessage("【快递到了】"+ele.content,ele.mobilePhone,function(err,data){
      if(!err){
        var jData=JSON.parse(data);
        if(jData.code=="0"){
          ele.code=jData.code;
          ele.msg=jData.msg;
          ele.result=jData.result;
          Send.create(ele, function(err, send) {
            if(err) { return handleError(res, err); }
          });
        }
      }
    })
  }
  res.jsonp({state:"ok",msg:"提交成功"})

};

// Updates an existing send in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Send.findById(req.params.id, function (err, send) {
    if (err) { return handleError(res, err); }
    if(!send) { return res.send(404); }
    var updated = _.merge(send, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, send);
    });
  });
};

// Deletes a send from the DB.
exports.destroy = function(req, res) {
  Send.findById(req.params.id, function (err, send) {
    if(err) { return handleError(res, err); }
    if(!send) { return res.send(404); }
    send.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
