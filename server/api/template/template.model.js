'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  templateId: String,
  isIncludeNum: Boolean,
  content: String
});

module.exports = mongoose.model('Template', TemplateSchema);
