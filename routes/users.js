var express = require('express');
var router = express.Router();

var users = require('../models/users_sqlite3');

//全部users的Json
router.get('/', function (req, res, next) {
  users.getAllUsers(data => res.json(data));
});


//全部users的清單
router.get('/list/', function (req, res, next) {
  users.getAllUsers(data => res.render('users/list', { users: data }));
});


//由id取得user的Json
router.get('/:id', function (req, res, next) {
  users.getUserById(req.params.id, user => res.json(user));
});


//由id取得user的詳細資料
router.get('/:id/detail', function (req, res, next) {
  users.getUserById(req.params.id, user => res.render('users/detail', { user: user }));
});


//新增user
//ex. curl -X POST -H 'Content-Type:application/json' -d '{"id":"a001","name":"Yiyang"}' http://localhost:3000/users
router.post('/', function (req, res, next) {
  users.addUser(req.body, info => res.json(info));
});


//更新user
//ex. curl -X PUT -H 'Content-Type:application/json' -d '{"name":"John Doe", "email":"john@outlook.com"}' http://localhost:3000/users/a1234
router.put('/:id', function (req, res, next) {
  users.updateUser(req.params.id, req.body, user => res.json(user))
});


//更新user部分資料
//ex. curl -X PATCH -H 'Content-Type:application/json' -d '{"name":"John Doe"}' http://localhost:3000/users/a1234
router.patch('/:id', function (req, res, next) {
  users.updateUser(req.params.id, req.body, user => res.json(user))
});


//刪除user
//ex. curl -X DELETE http://localhost:3000/users/a1234
router.delete('/:id', function (req, res, next) {
  users.deleteUser(req.params.id, info => res.json(info));
});


//刪除所有user
//ex. curl -X DELETE http://localhost:3000/users
router.delete('/', function (req, res, next) {
  users.deleteAllUsers(info => res.json(info));
});



module.exports = router;
