// db.js - MySQL 기반으로 변경한 DB 연결 및 초기화

import mysql from 'mysql2/promise';

// MySQL 연결 설정 (Docker로 띄운 MySQL에 맞게 수정)
const db = mysql.createPool({
  host: '192.168.0.14',         // 또는 Docker VM IP (예: 172.17.0.2)
  port: 3306,                // MySQL 기본 포트
  user: 'root',             // MySQL 사용자명
  password: 'sasp1234', // MySQL 비밀번호
  database: 'Sasp',         // 사용할 DB 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 테이블 초기화 함수
export async function initDB() {
  const conn = await db.getConnection();

// user 테이블 생성
  await conn.query(`
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userid VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL
)
  `);

  // board 테이블 생성 (XSS 실습용)
  await conn.query(`
CREATE TABLE IF NOT EXISTS board (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author) REFERENCES user(userid)
)
  `);

  conn.release();
  return db;
}
