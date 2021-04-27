
//載入Sqlite3
const sqlite3 = require('sqlite3').verbose();


//給SQLite3的回呼函數
const log_on_console = function (msg) {
  return function (err) {
    if (err) {
      console.error('DB_LOG', err.message);
      return;
    }
    console.log('DB_LOG', msg);
  }
};


const response_to_client = function (msg, callback) {
  return function (err) {
    if (err) {
      console.error('DB_LOG', err.message);
      callback({ message: '發生錯誤' });
      return;
    }
    msg['changes'] = this.changes;
    console.log('DB_LOG', msg);
    callback(msg);
  }
};


//開啟資料庫並連線
const db = new sqlite3.Database('./users.db', log_on_console('開啟資料庫並連線.'));


//程式關閉時關閉資料庫連線
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('DB_LOG', err.message);
      process.exit();
      return;
    }
    console.log('DB_LOG', '資料庫已關閉.');
    process.exit();
  });
});


//建立資料表
const create_table = () => {
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
};

create_table();


//查詢所有資料
module.exports.getAllUsers = (callback) => {
  db.all('SELECT * FROM users',
    (err, rows) => {
      console.log('DB_LOG', '查詢所有資料');
      if (err) {
        console.error('DB_LOG', err.message);
        callback({ result: '發生錯誤' });
        return;
      }
      callback(rows);
    });
};


//查詢user id
module.exports.getUserById = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id],
    (err, row) => {
      console.log('DB_LOG', '查詢user id');
      if (err) {
        console.error('DB_LOG', err.message);
        callback({ result: '發生錯誤' });
        return;
      }
      callback(row);
    });
};


//新增user
module.exports.addUser = (user, callback) => {
  db.run('INSERT INTO users(id, name, email) VALUES (?, ?, ?)',
    [user.id, user.name, user.email],
    response_to_client({ result: '資料已新增', data: user }, callback));
};


//更新user
module.exports.updateUser = (id, user, callback) => {
  const fields = Object.keys(user).map(key => `${key} = ?`).join(', ');

  db.run(`UPDATE users SET ${fields} WHERE id = '${id}'`,
    Object.values(user),
    response_to_client({ result: '資料已新增', id: id, data: user }, callback));
};


//刪除user
module.exports.deleteUser = (id, callback) => {
  db.run(`DELETE FROM users WHERE id = '${id}'`,
  response_to_client({ result: '資料已刪除', id: id}, callback));
};


//刪除全部user
module.exports.deleteAllUsers = (callback) => {
  db.run(`DELETE FROM users`,
  response_to_client({ result: '全部資料已刪除'}, callback));
};

