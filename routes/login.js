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
 * Path         : http://52.26.16.48:3000/login
 * Description  : 로그인을 시도합니다. 
 */
router.post('/', function(req, res, next) {
  connection.query('select * from Member where id=?;', [req.body.id], function (error, cursor) {
    if (cursor.length == 0) {
      // DB에 ID가 존재하지 않음
      res.status(404).json({ result : false, message : 'This ID is not exist' });
    } 
    else {
      if (cursor[0].pw == req.body.pw) {
        
        //debug
        console.log(req.body);
        
        connection.query('update Member set regid=? where id=?;', [req.body.regid, req.body.id], function (error, cursor) { 
          // debug
          // console.log('regid update 성공!');
        });       

        res.status(200).json({ result : true, id : cursor[0].id, name : cursor[0].name, htel : cursor[0].htel, email : cursor[0].email, 
                              univ : cursor[0].univ, pw : cursor[0].pw }); 
      }
      else {
        // DB와 PW가 다름
        res.status(401).json({ result : false, message : 'Password is not correct' });
      }
    }
  });
});

module.exports = router;