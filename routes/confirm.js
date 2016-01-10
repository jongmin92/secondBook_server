/* 
 * nodemailer = 인증 메일링을 위해 추가
 * mathjs = 난수 계산을 위해 추가
 */
var express = require('express');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var math = require('mathjs');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});

/*
 * (POST) http://localhost:3000/confirm/email
 */
router.post('/email', function(req, res, next) {
  
  // 1000~9999 난수(인증번호) 생성
  var confirmkey = Math.floor(Math.random()*(10000)) + 1;
  
  // Test> var email = '201101563@inu.ac.kr';
  var email = req.body.email;
  
  // debug
  console.log('email is = ' + email);
  
  connection.query('select * from Confirm where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor.length == 0) {
        connection.query('insert into Confirm (email, confirmkey) values (?,?);',
                         [req.body.email, confirmkey], function (error, info) {
          if (error == null) {
            // smtp 인증
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'kdhx92@gmail.com',
                pass: '12-73023879'
              }
            }, {
              // 보내는 사람
              from: 'master@second_book.org',
              headers: {
                'My-Awesome-Header': '123'
              }
            });
            // 메일 전송 (받는 사람)
            transporter.sendMail({
              to: req.body.email,
              subject: 'Second Book 가입 메일',
              text: 'Second Book 가입 인증 번호 : ' + confirmkey,
            });

            res.status(200).json({ result : true });
            //console.log('인증번호 발송 -> email : ' + email + ', 인증번호 : ' + confirmkey);
          } else {
            res.status(503).json({ result : false, message : 'Can not send Autho_Email' });
            //console.log('인증번호 발송 실패');
          }
        });
      } else {
        connection.query('update Confirm set confirmkey=? where email=?', [confirmkey, req.body.email], function (error, cursor) {
          if (error == null) {
            // smtp 인증
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'kdhx92@gmail.com',
                pass: '12-73023879'
              }
            }, {
              // 보내는 사람
              from: 'master@second_book.org',
              headers: {
                'My-Awesome-Header': '123'
              }
            });
            // 메일 전송 (받는 사람)
            transporter.sendMail({
              to: req.body.email,
              subject: 'Second Book 가입 메일',
              text: 'Second Book 가입 인증 번호 : ' + confirmkey,
            });

            res.status(200).json({ result : true });
            //console.log('인증번호 발송 -> email : ' + email + ', 인증번호 : ' + confirmkey);
          } else {
            res.status(503).json({ result : false, message : 'Can not send Autho_Email' });
            //console.log('인증번호 발송 실패');
          }
        });
      }
    }
  })
});

/*
 * (POST) http://localhost:3000/confirm
 */
router.post('/', function(req, res, next) {
  
  // debug
  console.log('email = ' + req.body.email + ' | confirmkey = ' + req.body.confirmkey);
  
  connection.query('select * from Confirm where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor[0].confirmkey == req.body.confirmkey) {
        connection.query('delete from Confirm where email=?;', [req.body.email], function (error, info) {
          if (error == null) {
            res.status(200).json({ result : true });
          }  
        });
      } else {
        res.status(401).json({ result : false, message : 'Do not correct your confirmkey' })
      }
    } else {
      res.status(503).json({ result : false, message : 'Do not exist confirmkey in DB' });
      //console.log('인증번호가 DB에 존재하지 않음');
    }
  });

});
  
module.exports = router;