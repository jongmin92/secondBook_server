var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});

/*
 * Method       : POST
 * Path         : http://52.26.16.48:3000/join
 * Description  : 회원가입을 합니다.
 */
router.post('/', function(req, res, next) {
  
  // email을 DB와 비교하여 이미 존재하면 회원가입이 되어있다고 알림, 존재하지 않는다면 새로 등록합니다.
  connection.query('select * from Member where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor.length == 0) {
        connection.query('insert into Member (id, pw, name, htel, email, univ) values (?,?,?,?,?,?);', 
                         [req.body.id, req.body.pw, req.body.name, req.body.htel, req.body.email, req.body.univ], function (error, info) {
          res.status(200).json({ result : true });
        });
      } else {
        // DB에 이미 존재하는 email (이미 회원가입 되어있음)
        res.status(406).json({ result : false, message : 'This email already exist' });
      }
    } else {
      // debug
      // console.log('server DB load error');
      // res.status(503).json({ result : false, message : 'server DB error' })
    }
  });
});

module.exports = router;