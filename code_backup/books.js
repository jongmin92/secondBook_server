/* 
 * string = 문자열 처리를 위해 추가
 * multer = 파일 저장을 위해 추가
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var S = require('string');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});
var multer = require('multer');

// 사진 저장 경로 설정 (AWS의 EC2를 사용할때 폴더에 권한부여 chmod +777 필수!)
var storage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'photos/');
  }
});
var upload = multer({ 
  storage: storage
});

// debug
// console.log('test');
// console.log(path.join(__dirname, '..', 'photos'));

/*
 * Method       : POST
 * Path         : http://52.26.16.48:3000/books
 * Description  : 판매하고자 하는 책을 등록합니다.
 */
//router.post('/', upload.single('img'), function(req, res, next) {
router.post('/', upload.array('img', 5), function(req, res, next) {
  // DB에 저장하기전에 ""(쌍따옴표를 없애기 위함)
  // ex-> S('Yes it does!').replaceAll(' ', '').s; //'Yesitdoes!' 
  var id = S(req.body.id).replaceAll('"', '').s;
  var bname = S(req.body.bname).replaceAll('"', '').s;
  var isbn = S(req.body.isbn).replaceAll('"', '').s;
  var oprice = S(req.body.oprice).replaceAll('"', '').s;
  var nprice = S(req.body.nprice).replaceAll('"', '').s;
  var mprice = S(req.body.mprice).replaceAll('"', '').s;
  var univ = S(req.body.univ).replaceAll('"', '').s;
  var enddate = S(req.body.enddate).replaceAll('"', '').s;
  var comment = S(req.body.comment).replaceAll('"', '').s;

  // debug
  console.log('IMG length : ' + req.files.length);
  
  connection.query('insert into Book (id, bname, isbn, oprice, nprice, mprice, univ, enddate, comment) values (?,?,?,?,?,?,?,?,?);',
                   [id, bname, isbn, oprice, nprice, mprice, univ, enddate, comment], function (error, info) {

    // debug
    //console.log(req);

    if (error == null) {
      var bnum;
      bnum = info.insertId;
      
      // debug (enddate 확인)
      //console.log(req.body.enddate);

      /*
      // 파일 이름 변경 (클라이언트로부터 전송된 파일을 photos로 저장후 '(bnum).jpg'로 이름을 변경한다.)
      fs.rename(__dirname + '/../photos/' + req.file.filename, __dirname + '/../photos/' + bnum + '.jpg', function (err) {
        if (err) throw err;
        // debug
        // console.log('renamed complete');
      });
      */
      
      res.status(200).json({ result : true });

    } else {
      // debug
      // console.log(req);
      // res.status(503).json({ result : false, message : 'server DB error', error });
    }
  });
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/books
 * Description  : 판매등록 되어있는 책의 목록을 불러옵니다.
 */
router.get('/', function(req, res, next) {

  connection.query('select bnum, bname, isbn, univ, oprice, nprice, mprice, enddate from Book ' + 'order by enddate asc;', function (error, cursor) {
    if (error == null) {
      console.log(cursor);
      res.status(200).json(cursor);
    } else {
      // debug
      // console.log(error);
      // res.status(503).json({ result : false, message : 'Server DB error, do not read book list', error });
    }
  });
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/books/{bnum}
 * Description  : 책의 목록 중 선택한 책의 상세 정보를 불러옵니다.
 */
router.get('/:bnum', function(req, res, next) {

  var buy_id;
  
  connection.query('select Deal.id as buyid from Deal where Deal.bnum=? order by Deal.date desc limit 1', [req.params.bnum], function (error, cursor) {
    if (cursor.length != 0)
      buy_id = cursor[0].buyid;
    else
      buy_id = 'null';

    connection.query('select Book.* from Book where Book.bnum=?', [req.params.bnum], function (error, cursor) {
      var data = {
        buyid : buy_id,
        bnum : cursor[0].bnum,
        id : cursor[0].id,
        bname : cursor[0].bname,
        isbn : cursor[0].isbn,
        oprice : cursor[0].oprice,
        nprice : cursor[0].nprice,
        univ : cursor[0].univ,
        mprice : cursor[0].mprice,
        startdate : cursor[0].startdate,
        enddate : cursor[0].enddate,
        comment : cursor[0].comment
      };
      
      
      res.status(200).json(data);
    });
  });
});

/*
 * Method       : GET
 * Path         : http://52.26.16.48:3000/books/picutre/{bnum}
 * Description  : 책에 해당하는 사진을 불러옵니다.
 */
router.get('/picture/:bnum', function(req, res, next) {

  // EC2에서의 코드
  // res.status(200).sendFile(path.join(__dirname, '..', 'photos', req.params.bnum + '.jpg'));
  // debug
  // res.status(200).sendFile(path.join(__dirname, '..', 'photos', req.params.bnum + '.jpg'));

  // 절대 경로로 응답
  res.status(200).sendFile('C:\\Users\\JongMin\\Documents\\Study\\SOPT\\sopt_workspace\\SecondBook_Server\\photos\\' + req.params.bnum + '.jpg');

});

module.exports = router;
