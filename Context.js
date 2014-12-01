/*
Login and Out Methods. Incomplete....
*/

var soap = require('soap');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

//change login details here
var userName = 'Login.sys'; //must be systyem login
var pwd = 'Password';

var url = 'http://paint.pure360.com/paint.pure360.com/ctrlPaintLiteral.wsdl'; //wsdl url
var beanId;

ee.on('beanId', function(){
  console.log(beanId);
});


soap.createClient(url, function(err, client) {
  client.handleRequest({
    "className":"bus_facade_context",
    "processName": "login",
    "entityData": {
      "pairs": [
        {
          "key": "password",
          "value": { "str": pwd }
        },
        {
          "key": "userName",
          "value": { "str": userName }
        }
      ]
    },
    "processData": {
    }
  },
  function(err, res) {
    console.log(client.lastRequest);
    beanId = JSON.stringify(res.Result.pairs[1].value.arr.pairs[3].value.arr.pairs[9].value.str, null, 2, true);
    ee.emit('beanId');

    fs.writeFile('bean.json', JSON.stringify(res.Result.pairs[1].value.arr.pairs[3].value.arr.pairs[9].value.str, null, 2, true), function (err) {
      if (err) throw err;
      console.log('BeanId / ContextId Saved!');
    });

    fs.writeFile('res.json', JSON.stringify(res, null, 2, true), function (err) {
      if (err) throw err;
      console.log('res saved');
    });
  });
});


function logout(beanId){
  soap.createClient(url,function(err, client){
    client.handleRequest({
      "contextId": beanId,
      "className":"bus_facade_context",
      "processName": "logout",
    },
    function(err, res){
      console.log(res);
    });
  });
}
