'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  userId:String,
  templateId: String,
  isIncludeNum: Boolean,
  content: String
});

module.exports = mongoose.model('Template', TemplateSchema);
