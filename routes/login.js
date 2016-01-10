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
 * (POST) http://localhost:3000/login
 */
router.post('/', function(req, res, next) {
  connection.query('select * from Member where id=?;', [req.body.id], function (error, cursor) {
    if (cursor.length == 0) {
      // DB에 ID가 존재하지 않음
      res.status(404).json({ result : false, message : 'This ID is not exist' });
    } else {
      if (cursor[0].pw == req.body.pw) {
        //res.status(200).json({ result : true, id : cursor[0].id, name : cursor[0].name, htel : cursor[0].htel, email : cursor[0].email,
        //univ : cursor[0].univ, pw : cursor[0].pw });
                             
        res.status(200).json({ result : true, id : cursor[0].id, name : cursor[0].name, htel : cursor[0].htel, email : cursor[0].email,
                              univ : cursor[0].univ });
      }
      else {
        // DB와 PW가 다름
        res.status(401).json({ result : false, message : 'Password is not correct' });
      }
    }
  });
});

module.exports = router;