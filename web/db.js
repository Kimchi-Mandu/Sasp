// db.js - MySQL 기반으로 변경한 DB 연결 및 초기화

import mysql from 'mysql2/promise';

// MySQL 연결 설정 (Docker로 띄운 MySQL에 맞게 수정)
const db = mysql.createPool({
  host: 'localhost',         // 또는 Docker VM IP (예: 172.17.0.2)
  port: 3306,                // MySQL 기본 포트
  user: 'root',             // MySQL 사용자명
  password: 'my-secret-pw', // MySQL 비밀번호
  database: 'mydb',         // 사용할 DB 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 테이블 초기화 함수
export async function initDB() {
  const conn = await db.getConnection();

  // users 테이블 생성
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user'
    )
  `);

  // posts 테이블 생성 (XSS 실습용)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title TEXT,
      content TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  conn.release();
  return db;
}
