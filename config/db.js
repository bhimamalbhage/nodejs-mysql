const mysql = require("mysql");

const connectDB = () => {
    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });
    return db;
  };
  
  module.exports = connectDB;
