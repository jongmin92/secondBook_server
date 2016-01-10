var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});
var multer = require('multer');
var storage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'photos/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".jpg");
    //cb(null, file.fieldname + '-' + Date.now() + ".jpg");
    //cb(null, file.fieldname + '-' + Date.now() + "." + file.split('.').pop());
  }
});
var upload = multer({ 
  storage: storage
});

/*
 * (POST) http://localhost:3000/test
 * 사진등록 test
 * test value : enddate -> 2016-12-31 23:59:59
 */

router.post('/', upload.single('img'), function(req, res, next) {

  console.log(req);

  res.status(200).json({ result : true });

  //res.status(200).json({ result : true });

  // 파일 이름 변경
  fs.rename(__dirname + '/../photos/' + req.file.filename, __dirname + '/../photos/1/1.jpg', function (err) {
    if (err) throw err;
    console.log('renamed complete');
  });
});

router.post('/model', function(req, res, next) {

  console.log(req);

  res.status(200).json({ result : true });

});

module.exports = router;