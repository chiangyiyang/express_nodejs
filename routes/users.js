var express = require('express');
var router = express.Router();

//模擬的資料
const users = [
  { id: 'a1234', name: 'John' },
  { id: 'a1235', name: 'Mary' },
  { id: 'a1236', name: 'Tom' },
]

//全部users的Json
router.get('/', function (req, res, next) {
  res.json(users);
});


//由id取得user的Json
router.get('/:id', function (req, res, next) {
  res.json(users.filter(user => user.id == req.params.id));
});

module.exports = router;
