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
 * Path         : http://52.26.16.48:3000/deals
 * Description  : 구입하고자 하는 책의 입찰을 등록합니다.
 */
/*
router.post('/', function(req, res, next) {
  // 구매자 ID
  var buyID = req.body.id;
  var sellID;
  
 // 
 // 경매에 참여한다. (1) Deal 테이블에 거래내역 저장, 
 //                (2) Book 테이블의 nprice(책의 현재경매 가격)를 update 함, 
 //                (3) Deal 테이블에서 최신 경매가격을 받아옴 
 //
  connection.query('insert into Deal (bnum, id, nprice) values (?,?,?);', [req.body.bnum, req.body.id, req.body.nprice], function (error, info) {
    if (error == null) {
      // 책의 가격(nprice) 업데이트
      connection.query('update Book set nprice=? where bnum=?', [req.body.nprice, req.body.bnum], function (error, cursor) {
       //debug
       console.log(cursor);
        // 책의 정보를 확인 (nprice와 mprice 비교 위함)
        connection.query('select id, nprice, mprice from Book where bnum=?', [req.body.bnum], function (error, cursor) {
          sellID = cursor[0].id; // 판매자 ID 저장
          
          // debug
          //console.log(cursor[0].mprice, cursor[0].nprice);
          
          // 경매 설정된 최대 가격과 현재 업데이트한 가격이 같을 경우 (낙찰)
          // 구매자, 판매자에게 푸시 (서로의 연락처 교환) 
          if ( cursor[0].mprice == cursor[0].nprice ) {
            // debug
            console.log("구매자, 판매자에게 푸시 (서로의 연락처 교환)");
            //
            // 책이름, 책 파는이(ID), 전화번호 푸시
            //
          } 
          // 경매 설정된 최대 가격과 현재 업데이트한 가격이 다를 경우 (낙찰X)
          // 판매자에게만 푸시 (알림만)
          else {
            // debug
            console.log("판매자에게만 푸시 (알림만)");
            
          }
          
          res.status(200).json({ nprice : cursor[0].nprice });  
          //res.status(200).json({ result : true, nprice : cursor[0].nprice });  
        });
      });
    } else {
     // Server DB Error
     // res.status(503).json({ result : false, message : 'do not deal regist', error });
    }
  });
});
*/


/*
 * Method       : POST
 * Path         : http://52.26.16.48:3000/deals
 * Description  : 구입하고자 하는 책의 입찰을 등록합니다.
 */
router.post('/', function(req, res, next) {
 // 구매자 id, 구매자 htel
 var buyID = req.body.id;
 var buyHTEL = req.body.htel;
 
 // 판매자 id, 판매자 htel
 var sellID;
 var sellHTEL;
 
 // 책 name
 var bookNAME;

 /* 
  * 경매에 참여한다. (1) Deal 테이블에 거래내역 저장, 
                   (2) Book 테이블의 nprice(책의 현재경매 가격)를 update 함, 
                   (3) Deal 테이블에서 최신 경매가격을 받아옴 
  */
 connection.query('insert into Deal (bnum, id, nprice) values (?,?,?);', [req.body.bnum, req.body.id, req.body.nprice], function (error, info) {
  if (error == null) {
   // 책의 가격(nprice) 업데이트
   connection.query('update Book set nprice=? where bnum=?', [req.body.nprice, req.body.bnum], function (error, cursor) {
    // 책의 정보를 확인 (nprice와 mprice 비교 위함)
    connection.query('select bname, id, nprice, mprice from Book where bnum=?', [req.body.bnum], function (error, cursor) {
     sellID = cursor[0].id; // 판매자 id 저장
     bookNAME = cursor[0].bname; // 책 name 저장
     
     // debug
     // console.log(cursor[0].mprice, cursor[0].nprice);
     // debug (판매자 정보)
     // console.log(sellID);
     
     // 경매 설정된 최대 가격과 현재 업데이트한 가격이 같을 경우 (낙찰)
     // 구매자, 판매자에게 푸시 (서로의 연락처 교환) 
     if ( cursor[0].mprice == cursor[0].nprice ) {
      // 판매자의 전화번호를 받아옴
      connection.query('select htel from Member where id=?', [sellID], function (error, cursor) {
       sellHTEL = cursor[0].htel;
            
       // debug
       // console.log('판매자 전화번호 ' + sellHTEL);
       
       connection.query('insert into Trade (bnum, bname, bid, bhtel, sid, shtel) values (?,?,?,?,?,?);', [req.body.bnum, bookNAME, buyID, buyHTEL, sellID, 
                                                                                                          sellHTEL], function (error, info) {
       });
      });
      
      // debug
      console.log("구매자, 판매자에게 푸시 (서로의 연락처 교환)");
      /* TODO
       * GCM
       */
     } 
     // 경매 설정된 최대 가격과 현재 업데이트한 가격이 다를 경우 (낙찰X)
     // 판매자에게만 푸시 (알림만)
     else {
      // debug
      console.log("판매자에게만 푸시 (알림만)");
      /* TODO
       * GCM
       */
     }

     res.status(200).json({ nprice : cursor[0].nprice });  
     //res.status(200).json({ result : true, nprice : cursor[0].nprice });  
    });
   });
  } else {
   // Server DB Error
   // res.status(503).json({ result : false, message : 'do not deal regist', error });
  }
 });
});


module.exports = router;