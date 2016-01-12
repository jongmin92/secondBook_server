var express = require('express');
var mysql = require('mysql');
var schedule = require('node-schedule');
var router = express.Router();
var connection = mysql.createConnection({
  'host' : 'aws-rds-mysql.chkoxmjtj4pn.us-west-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'whdals1!',
  'database' : 'sopt',
});


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
// var auctionEndConfirm = schedule.scheduleJob('0 0 18 * * *' , function() {

// 1초에 한번씩 실행
var auctionEndConfirm = schedule.scheduleJob('0-59 * * * * *' , function() {
  /*
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
  
  console.log('schedule interval time = 1sec 작동!');
});

// 

module.exports = router;
