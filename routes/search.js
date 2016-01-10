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
 * (GET) http://localhost:3000/search/isbn/{isbn}
 * ISBN을 통해 책을 검색한다.
 */
router.get('/isbn/:isbn', function(req, res, next) {

  //connection.query('select * from Book where isbn=?; ' + 'order by enddate desc;', [req.params.isbn], function (error, cursor) {
  connection.query('select * from Book where isbn=?;', [req.params.isbn], function (error, cursor) {
    if (error == null && cursor.length > 0) {
      res.status(200).json({ result : true, cursor });
    } else {
      res.status(503).json({ result : false, message : 'can not find book', error });
    }
  });
});

module.exports = router;
