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


//新增user
//ex. curl -X POST -H 'Content-Type:application/json' -d '{"id":"a001","name":"Yiyang"}' http://localhost:3000/users
router.post('/', function (req, res, next) {
  users.push(req.body);
  res.json(users);
});

module.exports = router;
