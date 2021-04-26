var express = require('express');
var router = express.Router();
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();


//給SQLite3的回呼函數
const log_on_console = (msg) => {
  return (err) => {
    if (err) {
      console.error('DB_LOG', err.message);
      return;
    }
    console.log('DB_LOG', msg);
  }
};


const response_to_client = (msg, callback) => {
  return (err) => {
    if (err) {
      console.error('DB_LOG', err.message);
      callback({ message: '發生錯誤' });
      return;
    }
    console.log('DB_LOG', msg);
    callback({ message: msg });
  }
};


//開啟資料庫並連線
const open_db = () => new sqlite3.Database('./users.db', log_on_console('開啟資料庫並連線.'));


//建立資料表
const create_table = () => {
  const db = open_db();
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id text PRIMARY KEY, name text, email text)',
      (err) => {
        if (err) {
          console.error('DB_LOG', err.message);
          return;
        }
        console.log('DB_LOG', '建立資料表.');
      });

    //新增模擬的user
    [
      { id: 'a1234', name: 'John', email: 'john@gmail.com' },
      { id: 'a1235', name: 'Mary', email: 'mary@gmail.com' },
      { id: 'a1236', name: 'Tom', email: 'tom@gmail.com' }
    ].forEach(user => {
      db.run('INSERT INTO users(id, name, email) VALUES (?, ?, ?)',
        [user.id, user.name, user.email],
        log_on_console('新增模擬的user'));
    });
  });

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};

create_table();


//查詢所有資料
const getAllUsers = (callback) => {
  const db = open_db();

  db.all('SELECT * FROM users',
    (err, rows) => {
      console.log('DB_LOG', '查詢所有資料');
      if (err) {
        console.error('DB_LOG', err.message);
        callback({ message: '發生錯誤' });
        return;
      }
      callback(rows);
    });

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};


//查詢user id
const getUserById = (id, callback) => {
  const db = open_db();

  db.get('SELECT * FROM users WHERE id = ?', [id],
    (err, row) => {
      console.log('DB_LOG', '查詢user id');
      if (err) {
        console.error('DB_LOG', err.message);
        callback({ message: '發生錯誤' });
        return;
      }
      callback(row);
    });

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};


//新增user
const addUser = (user, callback) => {
  const db = open_db();

  db.run('INSERT INTO users(id, name, email) VALUES (?, ?, ?)',
    [user.id, user.name, user.email],
    response_to_client({ result: 'user已新增', data: user }, callback));

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};


//更新user
const updateUser = (id, user, callback) => {
  const db = open_db();

  const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');

  db.run(`UPDATE users SET ${fields} WHERE id = '${id}'`,
    Object.values(user),
    response_to_client({ result: `user ${id} 已更新`, data: user }, callback));

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};


//刪除user
const deleteUser = (id, callback) => {
  const db = open_db();

  db.run(`DELETE FROM users WHERE id = '${id}'`,
  response_to_client({ result: `user ${id} 已刪除`}, callback));

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};

//刪除全部user
const deleteAllUsers = (callback) => {
  const db = open_db();

  db.run(`DELETE FROM users`,
  response_to_client({ result: `全部user已刪除`}, callback));

  //關閉資料庫
  db.close(log_on_console('關閉資料庫.'));
};


//全部users的Json
router.get('/', function (req, res, next) {
  getAllUsers(data => res.json(data));
});


//由id取得user的Json
router.get('/:id', function (req, res, next) {
  getUserById(req.params.id, user => res.json(user));
});


//新增user
//ex. curl -X POST -H 'Content-Type:application/json' -d '{"id":"a001","name":"Yiyang"}' http://localhost:3000/users
router.post('/', function (req, res, next) {
  addUser(req.body, info => res.json(info));
});


//更新user
//ex. curl -X PUT -H 'Content-Type:application/json' -d '{"name":"John Doe", "email":"john@outlook.com"}' http://localhost:3000/users/a1234
router.put('/:id', function (req, res, next) {
  updateUser(req.params.id, req.body, user => res.json(user))
});


//更新user部分資料
//ex. curl -X PATCH -H 'Content-Type:application/json' -d '{"name":"John Doe"}' http://localhost:3000/users/a1234
router.patch('/:id', function (req, res, next) {
  updateUser(req.params.id, req.body, user => res.json(user))
});


//刪除user
//ex. curl -X DELETE http://localhost:3000/users/a1234
router.delete('/:id', function (req, res, next) {
  deleteUser(req.params.id, info => res.json(info));
});


//刪除所有user
//ex. curl -X DELETE http://localhost:3000/users
router.delete('/', function (req, res, next) {
  deleteAllUsers(info => res.json(info));
});

module.exports = router;
