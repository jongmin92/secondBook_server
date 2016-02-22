var express = require('express');
var mysql = require('mysql');
var gcm = require('node-gcm');
var schedule = require('node-schedule');
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


//var rule = new schedule.RecurrenceRule();
//rule.second = 3;

/*
 *     스케줄러 함수
 * 매일 오후6시(18)시에 한번 실행됨. 
 * DB에 저장되어 있는 책의 경매 시간이 종료되었는지 확인한다.
 * 경매기간이 끝난 책이 있다면 판매자에게 푸시알림을 보낸다.
 
 *    *    *    *    *    *
 ┬    ┬    ┬    ┬    ┬    ┬
 │    │    │    │    │    |
 │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 │    │    │    │    └───── month (1 - 12)
 │    │    │    └────────── day of month (1 - 31)
 │    │    └─────────────── hour (0 - 23) 
 │    └──────────────────── minute (0 - 59)
 └───────────────────────── second (0 - 59, OPTIONAL)
 */

// 매일 저녁 6시(18시)에 실행
// <Test> var auctionEndConfirm = schedule.scheduleJob('0 * * * * *' , function() {
var auctionEndConfirm = schedule.scheduleJob('0 0 18 * * *' , function() {
  var gcminfo = new Array();
  // debug
  console.log('schedule 작동 시작!');
  
              connection.query('SELECT Book.bnum, Book.bname, Deal.id AS bid, Member.htel AS bhtel, Book.id AS sid, Member_1.htel AS shtel, Member.regid AS buyREGID, Member_1.regid AS sellREGID FROM Deal INNER JOIN Book ON Deal.bnum=Book.bnum AND Book.nprice=Deal.nprice INNER JOIN Member ON Deal.id=Member.id INNER JOIN Member Member_1 ON Book.id=Member_1.id WHERE DATE(Book.enddate)=DATE(NOW());', function (error, cursor) {
    if ((error == null) && (cursor.length != 0)) {
      gcminfo = cursor;
      
      for (var i=0; i<cursor.length; i++) {
        connection.query('insert into Trade (bnum, bname, bid, bhtel, sid, shtel) values (?,?,?,?,?,?);', [cursor[i].bnum, cursor[i].bname, cursor[i].bid, cursor[i].bhtel, cursor[i].sid, cursor[i].shtel]);        
      } // for문 끝
      
      console.log('-----gcm 전송 시작-----');
      
      for (var i=0; i<gcminfo.length; i++) {
        // gcm
        var registrationIds = [];
        registrationIds.push(gcminfo[i].sellREGID);
        registrationIds.push(gcminfo[i].buyREGID);
        
        // debug
        console.log('---debug---');
        console.log(registrationIds);
        console.log(gcminfo[i].bname);
        
        message.addData('message', '[' + gcminfo[i].bname + ']의 경매가 확정되었습니다. 상대방을 확인하세요!');
        sender.send(message, registrationIds, 4, function (err, result) {
          // debug
          if (error)
            console.log(error);
          else
            console.log(result);
        }); 
        // gcm 끝
      } // for문 끝
      
      
      // debug
      // console.log(gcminfo);

      // debug
      // console.log('cursor[i].sellREGID : ' + cursor[i].sellREGID);
      // console.log('cursor[i].buyREGID : ' + cursor[i].buyREGID);
    } else {
      console.log(error);
    }
  });
  
  // debug
  console.log('schedule 작동 끝!');
});

  
  
  /*
  connection.query('select bnum, bname, id from Book where date(enddate) = date(now());', function (error, cursor) {
    if (error == null) {
      console.log('성공');
    }
  });
  */
  /* 참고
  connection.query('select * from Book;', [req.params.book_id], function (error, cursor) {
    if (error == null && cursor.length > 0 && ) {
      res.status(200).json(cursor[0]);
      
      //res.status(200).json({ result : true, bnum : cursor[0].bnum, bname : cursor[0].bname, isbn : cursor[0].isbn, oprice : cursor[0].oprice, 
                           nprice : cursor[0].nprice, nuiv : cursor[0].univ, enddate : cursor[0].enddate, maxprice : cursor[0].maxprice});
      //res.status(200).json({ result : true, cursor[0] });          
      
    } else {
      res.status(503).json({ result : false, message : 'can not find selected book', error });
    }
  });
  */

module.exports = router;
