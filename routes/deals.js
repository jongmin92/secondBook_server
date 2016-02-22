var express = require('express');
var mysql = require('mysql');
var gcm = require('node-gcm');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});
var message = new gcm.Message();
var message = new gcm.Message({
  collapseKey: 'demo',
  delayWhileIdle: true,
  timeToLive: 3,
  data: {
    title: 'SecondBook 알림!'
    //message: '경매가 확정되었습니다. 상대방의 정보를 확인하세요!'
  }
});
var server_api_key = 'AIzaSyA1RxAKEAaWj438vChaTZCKzzKL87q8FK0';
var sender = new gcm.Sender(server_api_key);

/*
 * Method       : POST
 * Path         : http://52.26.16.48:3000/deals
 * Description  : 구입하고자 하는 책의 입찰을 등록합니다.
 */
router.post('/', function(req, res, next) {
  // 구매자 id, 구매자 htel, 구매자 regid
  var buyID = req.body.id;
  var buyHTEL = req.body.htel;
  var buyREGID;

  // 판매자 id, 판매자 htel, 판매자 regid
  var sellID;
  var sellHTEL;
  var sellREGID;

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
            connection.query('select htel, regid from Member where id=?', [sellID], function (error, cursor) {
              sellHTEL = cursor[0].htel;
              sellREGID = cursor[0].regid;
              // debug
              // console.log('판매자 전화번호 ' + sellHTEL);
              // console.log('판매자 regid ' + sellREGID);

              connection.query('select htel, regid from Member where id=?', [buyID], function (error, cursor) {
                buyHTEL = cursor[0].htel
                buyREGID = cursor[0].regid;

                // debug
                /*
        console.log('bnum ' + req.body.bnum);
        console.log('bname' + bookNAME);
        console.log('bid' + buyID);
        console.log('bhtel' + buyHTEL);
        console.log('sid' + sellID);
        console.log('shtel' +sellHTEL);
        */
                connection.query('insert into Trade (bnum, bname, bid, bhtel, sid, shtel) values (?,?,?,?,?,?);', [req.body.bnum, bookNAME, buyID, buyHTEL, sellID, 
                                                                                                                   sellHTEL], function (error, info) {
                  // TODO[GCM]
                  var registrationIds = [];
                  registrationIds.push(sellREGID);
                  registrationIds.push(buyREGID);
                  message.addData('message', '[' + bookNAME + ']의 경매가 확정되었습니다. 상대방을 확인하세요!');
                  sender.send(message, registrationIds, 4, function (err, result) {
                    // debug
                    // console.log(result);
                  });
                });
              });
            });
            // debug
            console.log("구매자, 판매자에게 푸시 (서로의 연락처 교환)");
<<<<<<< HEAD
            console.log('sellREGID : ', sellREGID);
            console.log('buyREGID : ', buyREGID);
=======
            // console.log('sellREGID : ', sellREGID);
            // console.log('buyREGID : ', buyREGID);
>>>>>>> origin/master
          
          // 경매 설정된 최대 가격과 현재 업데이트한 가격이 다를 경우 (낙찰X)
          // 판매자에게만 푸시 (알림만)
          }
          else {
            // debug
            console.log("이전 입찰예정자에게만 푸시 (알림만)");
            connection.query('select Member.regid from Member where Member.id = (select Deal.id from Deal where Deal.bnum=? order by Deal.date desc limit 1)', [req.body.bnum], function (error, cursor) {
              // TODO[GCM]
              var registrationIds = [];
              registrationIds.push(cursor[0].regid);
              
              message.addData('message', '[' + bookNAME + ']의 입찰예정자가 변경되었습니다!');
              sender.send(message, registrationIds, 4, function (err, result) {
                // debug
                // console.log(result);
              });
              
              //debug
<<<<<<< HEAD
              console.log(registrationIds);
=======
              //console.log(registrationIds);
>>>>>>> origin/master
            });
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
<<<<<<< HEAD

=======
>>>>>>> origin/master

module.exports = router;
