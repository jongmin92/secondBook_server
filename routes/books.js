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
 * (POST) http://localhost:3000/books
 * 경매할 책을 등록한다.
 * test value : enddate -> 2016-12-31 23:59:59
 */


router.post('/', upload.single('img'), function(req, res, next) {
  // id, univ, 빼고
  connection.query('insert into Book (id, bname, isbn, nprice, mprice, univ, enddate, comment) values (?,?,?,?,?,?,?,?);',
                   ['aaa', req.body.bname, req.body.isbn, req.body.nprice, req.body.mprice, 'bbb', req.body.enddate, req.body.comment], function (error, info) {
    
    // req 확인
    //console.log(req);
    //
    if (error == null) {
      
      var bnum;
      bnum = info.insertId;
      
      //end date 확인
      console.log(req.body.enddate);
      
      // 파일 이름 변경
      fs.rename(__dirname + '/../photos/' + req.file.filename, __dirname + '/../photos/' + bnum + '.jpg', function (err) {
        if (err) throw err;
        console.log('renamed complete');
      });

      res.status(200).json({ result : true, filename : req.file.filename });     
      //res.status(200).json({ result : true });
      
    } else {
      res.status(503).json({ result : false, message : 'do not regist', error });
    
      // req 확인
      console.log(req);
      //
    }
  });
});
            
  /* 살려놔!!!!!!!
  connection.query('insert into Book (id, bname, isbn, nprice, mprice, univ, enddate, comment) values (?,?,?,?,?,?,?,?);',
                   [req.body.id, req.body.bname, req.body.isbn, req.body.nprice, req.body.mprice, req.body.univ, req.body.enddate, req.body.comment], function (error, info) {
    if (error == null) {
      res.status(200).json({ result : true });
    } else {
      res.status(503).json({ result : false, message : 'do not regist', error });
    }
  });
  */

/*
 * (GET) http://localhost:3000/books
 * 경매되고 있는 책의 목록을 불러온다. (경매가 곧 끝나는 순서대로)
 */
router.get('/', function(req, res, next) {

  connection.query('select bnum, bname, isbn, oprice, nprice, enddate from Book ' + 'order by enddate desc;', function (error, cursor) {
    if (error == null) {
      res.status(200).json({ result : true, cursor });
    } else {
      res.status(503).json({ result : false, message : 'do not read book list', error });
    }
  });
});

/*
 * (GET) http://localhost:3000/books/{book_id}
 * 책의 목록 중 선택한 책의 상세 정보를 불러온다.
 */
router.get('/:book_id', function(req, res, next) {

  connection.query('select * from Book where bnum=?;', [req.params.book_id], function (error, cursor) {
    if (error == null && cursor.length == 1) {
      res.status(200).json(cursor[0]);
      /*
      res.status(200).json({ result : true, bnum : cursor[0].bnum, bname : cursor[0].bname, isbn : cursor[0].isbn, oprice : cursor[0].oprice, 
                           nprice : cursor[0].nprice, nuiv : cursor[0].univ, enddate : cursor[0].enddate, maxprice : cursor[0].maxprice});
      res.status(200).json({ result : true, cursor[0] });          
      */
    } else {
      res.status(503).json({ result : false, message : 'can not find selected book', error });
    }
  });
});

module.exports = router;
