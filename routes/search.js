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
 * Path         : http://52.26.16.48:3000/search/isbn/{isbn}
 * Description  : ISBN을 통해 책을 검색합니다.
 */
router.get('/isbn/:isbn', function(req, res, next) {
  // TODO
  // 검색순서?
  // connection.query('select * from Book where isbn=?; ' + 'order by enddate desc;', [req.params.isbn], function (error, cursor) {
  connection.query('select * from Book where isbn=?;', [req.params.isbn], function (error, cursor) {
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
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/search/bname/{bname}
 * Description  : 책이름을 통해 책을 검색합니다.
 */
router.get('/bname/:bname', function(req, res, next) {
//  connection.query('select * from Book where bname like "노트북";', function (error, cursor) {
  connection.query('select * from Book where bname like "%"?"%";', [req.params.bname], function (error, cursor) {
    if (error == null) {
      if (cursor.length > 0) {
        res.status(200).json(cursor);  
      } else {
        res.status(503).json({ message : 'Can not find with this bname' })
      }
    } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find book', error });
    }
  });
});

module.exports = router;
