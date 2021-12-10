// const mysql = require('mysql2/promise');

// const path = require('path');

// require('dotenv').config({ path: path.join(__dirname, '../.env.test') });

// const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

// //connect to database and run a drop database statement
// const dropDatabase = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: DB_HOST,
//       user: DB_USER,
//       password: DB_PASSWORD,
//       port: DB_PORT,
//     });

//     await connection.query(`DROP DATABASE ${DB_NAME}`, () => connection.end());
//   } catch (err) {
//     console.log(err);
//   }
// };

// dropDatabase();

const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.test'),
});

const { DB_PASSWORD, DB_NAME, DB_USER, DB_HOST, DB_PORT } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

connection.query(`DROP DATABASE ${DB_NAME}`, () => connection.end());
