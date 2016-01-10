var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
  console.log('sucess upload photo');
  res.status(200).json({ result : 'true' });
});
/*
router.post('/', upload.single('test'), function (req, res, next) {
  console.log('sucess upload photo');
  res.status(200).json({ result : 'true' });
});
*/
module.exports = router;