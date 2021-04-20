var express = require('express');
var router = express.Router();

//模擬的資料
let users = [
  { id: 'a1234', name: 'John', email: 'john@gmail.com' },
  { id: 'a1235', name: 'Mary', email: 'mary@gmail.com' },
  { id: 'a1236', name: 'Tom', email: 'tom@gmail.com' },
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


//更新user
//ex. curl -X PUT -H 'Content-Type:application/json' -d '{"name":"John Doe", "email":"john@outlook.com"}' http://localhost:3000/users/a1234
router.put('/:id', function (req, res, next) {
  users = users.map(user => {
    if (user.id == req.params.id) {
      user = req.body;
      user.id = req.params.id;
    }
    return user;
  });
  res.json(users);
});


//更新user部分資料
//ex. curl -X PATCH -H 'Content-Type:application/json' -d '{"name":"John Doe"}' http://localhost:3000/users/a1234
router.patch('/:id', function (req, res, next) {
  users = users.map(user => {
    if (user.id == req.params.id) {
      Object.keys(req.body).forEach(key => user[key] = req.body[key])
    }
    return user;
  });
  res.json(users);
});


//刪除user
//ex. curl -X DELETE http://localhost:3000/users/a1234
router.delete('/:id', function (req, res, next) {
  users = users.filter(user => user.id != req.params.id);
  res.json(users);
});

module.exports = router;
