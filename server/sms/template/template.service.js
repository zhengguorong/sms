/**
 * Created by zgr on 2015/5/31.
 */

var http=require("http"),
    querystring = require('querystring');


var SMSHOST="yunpian.com";
var APIKEY="667f769df383af6bb9efe934fa2e84e6";
var TPL_ADD="/v1/tpl/add.json";
var TPL_GET="/v1/tpl/get.json ";


function createTemplate(template,callback){
  var params={};
  params.apikey=APIKEY;
  params.tpl_content=template;
  params.notify_type=0;
  createRequest(params,TPL_ADD,callback)
}
function getTemplateById(templateId,callback){
  var params={};
  params.apikey=APIKEY;
  params.tpl_id=templateId;
  createRequest(params,TPL_GET,callback);

}
/**
 * 创建post请求
 * @param params 请求参数
 * @param path  请求路劲
 * @param callback 请求回调
 */
function createRequest(params,path,callback){
  var postData=querystring.stringify(params);
  var opt={
    method: "POST",
    host: SMSHOST,
    path: path
  };
  var req=http.request(opt, function (res) {
    if(res.statusCode=="200"){
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        callback&&callback(null,chunk);
      });
    }
  })
  req.on('error', function (e) {
    callback&&callback(e.message);
  });
  req.write(postData);
  req.end()
}
exports.createTemplate=createTemplate;
exports.getTemplateById=getTemplateById;
