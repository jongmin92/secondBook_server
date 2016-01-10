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
 * (POST) http://localhost:3000/deals
 * 경매에 참여한다. (1) Deal 테이블에 거래내역 저장, 
                  (2) Book 테이블의 nprice(책의 현재경매 가격)를 update 함, 
                  (3) Deal 테이블에서 최신 경매가격을 받아옴 
 */


// 알림 넣기 전(원본)
router.post('/', function(req, res, next) {

  connection.query('insert into Deal (bnum, id, nprice) values (?,?,?);', [req.body.bnum, req.body.id, req.body.nprice], function (error, info) {
    if (error == null) {
      connection.query('update Book set nprice=? where bnum=?', [req.body.nprice, req.body.bnum], function (error, cursor) {
        connection.query('select nprice from Deal where bnum=? ' + 'order by date desc;', [req.body.bnum], function (error, cursor) {
          res.status(200).json({ result : true, nprice : cursor[0].nprice });
        });
      });      
    } else {
      res.status(503).json({ result : false, message : 'do not deal regist', error });
    }
  }); 
});

/*
 * (POST) http://localhost:3000/deals
 * 경매에 참여한다. (1) Deal 테이블에 거래내역 저장, 
                  (2) Book 테이블의 nprice(책의 현재경매 가격)를 update 함, 
                  (3) Deal 테이블에서 최신 경매가격을 받아옴 
 */

/*
router.post('/', function(req, res, next) {

  connection.query('insert into Deal (bnum, id, nprice) values (?,?,?);', [req.body.bnum, req.body.id, req.body.nprice], function (error, info) {
    if (error == null) {
      // 가격(nprice) 업데이트
      connection.query('update Book set nprice=? where bnum=?', [req.body.nprice, req.body.bnum], function (error, cursor) {
        // 클라에게 최신 가격을 보내줌
        connection.query('select nprice from Deal where bnum=? ' + 'order by date desc;', [req.body.bnum], function (error, cursor) {
          // 책의 정보를 확인
          connection.query('select nprice, mprice from Book where bnum=?', [req.body.bnum], function (error, cursor) {
            // 경매 설정된 최대 가격과 현재 업데이트하는 가격이 같을 경우 (낙찰)
            
            console.log(cursor);
            //console.log(cursor[0].mprice, cursor[0].nprice);
            
            if ( cursor[0].mprice == cursor[0].nprice ) {
              console.log("낙찰처리 필요");
            }
            
          });
        });
      res.status(200).json({ result : true, nprice : cursor[0].nprice });
      });      
    } else {
      res.status(503).json({ result : false, message : 'do not deal regist', error });
    }
  });
});
*/

module.exports = router;