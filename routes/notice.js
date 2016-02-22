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
router.get('/trades/:id', function(req, res, next) {
  // 입찰조건을 만족한 사용자와 판매자의 정보를 받아옴
  connection.query('select * from Trade where bid=? or sid=? ' + 'order by date desc;', [req.params.id, req.params.id], function (error, cursor) {
    if (error == null) {
      if (cursor.length > 0) {
        res.status(200).json(cursor);  
      } else {
        res.status(503).json({ message : 'Can not find this id_trades' });
      }
    } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find trade', error });
<<<<<<< HEAD
    }
  });
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/notice/sells/{id}
 * Description  : 자신이 판매하고 있는 책의 현재 경매상황을 받아옵니다. (책번호, 책이름, 현재 경매가격)
 */
router.get('/sells/:id', function(req, res, next) {
  // connection.query('select bnum, bname, isbn, nprice, mprice, enddate from Book ' + 'order by enddate desc;', function (error, cursor) {
  // 자신이 판매하고 있는 책의 현재 경매상황을 받아옴
  connection.query('select bnum, bname, nprice from Book where id=? ' + 'order by enddate desc;', [req.params.id], function (error, cursor) {
    if (error == null) {
      if (cursor.length > 0) {
        res.status(200).json(cursor);  
      } else {
        // 자신이 판매하고 있는 책이 없음.
        res.status(503).json({ message : 'Can not find with sell_books' })
      }
    } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find trade', error });
=======
>>>>>>> origin/master
    }
  });
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/notice/sells/{id}
 * Description  : 자신이 판매하고 있는 책의 현재 경매상황을 받아옵니다. (책번호, 책이름, 현재 경매가격)
 */
router.get('/sells/:id', function(req, res, next) {
  // connection.query('select bnum, bname, isbn, nprice, mprice, enddate from Book ' + 'order by enddate desc;', function (error, cursor) {
  // 자신이 판매하고 있는 책의 현재 경매상황을 받아옴
  connection.query('select bnum, bname, nprice from Book where id=? ' + 'order by enddate desc;', [req.params.id], function (error, cursor) {
    if (error == null) {
      if (cursor.length > 0) {
        res.status(200).json(cursor);  
      } else {
        // 자신이 판매하고 있는 책이 없음.
        res.status(503).json({ message : 'Can not find with sell_books' })
      }
    } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find trade', error });
    }
  });
});

module.exports = router;
