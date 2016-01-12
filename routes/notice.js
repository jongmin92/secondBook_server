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
 * Method       : GET
 * Path         : http://52.26.16.48:3000/notice/trade/{id}
 * Description  : 입찰조건을 만족한 사용자와 판매자의 정보를 받아옵니다.
 */
router.get('/trade/:id', function(req, res, next) {
  
  // 자신이 판매하고 있는 책에 대한 구매자의 정보를 받아옴
  connection.query('select bid, bhtel from Book where sid=?;', [req.params.id], function (error, cursor) {
    if (error == null) {
      if (cursor.length > 0) {
        res.status(200).json(cursor);  
      } else {
        res.status(503).json({ message : 'Can not find with this isbn' })
      }
    } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find book', error });
    }
  });
  
  // 자신이 구매하는 책에 대한 판매자의 정보를 받아옴
});

module.exports = router;