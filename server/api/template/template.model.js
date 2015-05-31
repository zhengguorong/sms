'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  userId:String,
  templateId: String,
  templateName:String,
  isIncludeNum: Boolean,
  content: String,
  state:String
});

module.exports = mongoose.model('Template', TemplateSchema);
