// routes/login.js
import express from 'express';

export default function makeLoginRouter(db) {
  const router = express.Router();

  // 로그인 페이지 렌더링 (GET /login)
  router.get('/', (req, res) => {
    res.render('login'); // views/login.ejs 렌더링
  });

  // 로그인 처리 (POST /login)
  // ※ SQL Injection 취약점 포함: 사용자 입력을 그대로 SQL 쿼리에 삽입
  router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // ❗️주의: SQL Injection 실습을 위해 입력값을 그대로 문자열 삽입
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const [rows] = await db.query(query); // 첫 번째 일치하는 사용자 검색
    const user = rows[0];
    
    if (user) {
      req.session.user = user; // 로그인 성공 시 세션에 사용자 정보 저장
      res.redirect(`/profile/${user.id}`); // 프로필 페이지로 이동
    } else {
      res.send('로그인 실패'); // 로그인 실패 메시지 출력
    }
  });

  return router;
}
