var express = require('express');
var gcm = require('node-gcm');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});
var message = new gcm.Message();

var message = new gcm.Message({
  collapseKey: 'demo',
  delayWhileIdle: true,
  timeToLive: 3,
  data: {
    title: 'saltfactory GCM demo',
    message: 'Google Cloud Messaging 테스트’,
    custom_key1: 'custom data1',
    custom_key2: 'custom data2'
  }
});

var server_api_key = ‘GCM 앱을 등록할때 획득한 Server API Key’;
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];

var token = ‘Android 디바이스에서 Instance ID의 token’;
registrationIds.push(token);

sender.send(message, registrationIds, 4, function (err, result) {
  console.log(result);
});

module.exports = router;
