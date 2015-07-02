'use strict';

var _ = require('lodash');
var Template = require('./template.model');
var TemplateService=require('../../sms/template/template.service');

// Get list of templates
exports.index = function(req, res) {
  Template.find(function (err, templates) {
    if(err) { return handleError(res, err); }
    return res.json(200, templates);
  });
};

// Get a single template
exports.show = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    return res.json(template);
  });
};

//Get list by userId
exports.getByUserId=function(req,res){
  Template.find({userId:req.user["_id"]},function(err,templates){
    for(var i=0;i<templates.length;i++){
      if(templates[i].state=="CHECKING"){
        updateTemplateState(templates[i])
      }
    }
    if(err) { return handleError(res, err); }
    return res.json(200, templates);
  })
}
var updateTemplateState=function(template){
  TemplateService.getTemplateById(template.templateId,function(err,data){
    if(!err){
      var jData=JSON.parse(data);
      if(jData.code==0){
        if(jData.template["check_status"]=="SUCCESS"){
          template.state="SUCCESS";
          template.save();
        }
      }
    }
  })
}

// Creates a new template in the DB.
exports.create = function(req, res) {
  req.body.userId=req.user["_id"];
  TemplateService.createTemplate(req.body.content.replace("#编号#","#number#"),function(err,data){
    if(!err){
      var jData=JSON.parse(data);
      if(jData.code=="0"){
        req.body.templateId=jData.template["tpl_id"];
        req.body.state=jData.template["check_status"];
        Template.create(req.body, function(err, template) {
          if(err) { return handleError(res, err); }
          return res.json(201, template);
        });
      }else{
        return res.json(201, jData);
      }
    }else{
      res.jsonp({state:"err",msg:"网络异常"})
    }

  })

};

// Updates an existing template in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Template.findById(req.params.id, function (err, template) {
    if (err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    var updated = _.merge(template, req.body);
    TemplateService.updateTemplate(updated,function(err,data){
      if(!err){
        var jData=JSON.parse(data);
        if(jData.code==0){
          updated.state=jData.template["check_status"];
          updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, template);
          });
        }else{
          res.jsonp({state:"err",msg:"修改失败"})
        }

      }else{
        return handleError(res,err);
      }

    })

  });
};

// Deletes a template from the DB.
exports.destroy = function(req, res) {
  Template.findById(req.params.id, function (err, template) {
    if(err) { return handleError(res, err); }
    if(!template) { return res.send(404); }
    TemplateService.deleteTemplate(template.templateId,function(err,data){
      if(!err){
        var jData=JSON.parse(data);
        if(jData.code==0){
          template.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
          });
        }else{
          res.jsonp({state:"err",msg:"删除失败"})
        }

      }else{
        return handleError(res,err);
      }

    })

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
