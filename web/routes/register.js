// routes/register.js
import express from 'express';

export default function makeRegisterRouter(db) {
  const router = express.Router();

  // 회원가입 페이지 렌더링 (GET /register)
  router.get('/', (req, res) => {
    res.render('register'); // views/register.ejs 렌더링
  });

  // 회원가입 처리 (POST /register)
  router.post('/', async (req, res) => {
    const { username, password } = req.body; // 입력받은 값 추출

    // users 테이블에 새 사용자 추가 (비밀번호 평문 저장 - 실습용)
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );

    res.redirect('/login'); // 회원가입 후 로그인 페이지로 이동
  });

  return router; // app.js에 등록할 라우터 반환
}
