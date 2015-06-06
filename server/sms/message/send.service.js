/**
 * Created by zgr on 2015/5/31.
 */

var http=require("http"),
    querystring = require('querystring');


var SMSHOST="121.41.167.43";
var APIKEY="667f769df383af6bb9efe934fa2e84e6";
//通用发送接口的http地址
var URI_SEND_SMS = "/v1/sms/send.json";

function sendMessage(content,mobile,callback){
  var params={};
  params.apikey=APIKEY;
  params.text=content;
  params.mobile=mobile;
  createRequest(params,URI_SEND_SMS,callback)
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
exports.sendMessage=sendMessage;
