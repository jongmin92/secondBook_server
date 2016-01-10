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
 * (POST) http://localhost:3000/join
 */
router.post('/', function(req, res, next) {
  connection.query('select * from Member where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor.length == 0) {
        connection.query('insert into Member (id, pw, name, htel, email, univ) values (?,?,?,?,?,?);', 
                         [req.body.id, req.body.pw, req.body.name, req.body.htel, req.body.email, req.body.univ], function (error, info) {
          res.status(200).json({ result : true });
        });
      } else {
        // DB에 이미 존재하는 email (email 중복)
        res.status(406).json({ result : false, message : 'This email already exist' });
      }
    } else {
      res.status(503).json({ result : false, message : 'join fail' })
    }
  });
});

module.exports = router;