// routes/profile.js - 사용자 프로필 조회 기능 (IDOR 실습용)

// express 모듈 불러오기
import express from 'express';

// app.js에서 db 객체를 전달받아 라우터 생성
export default function makeProfileRouter(db) {
  const router = express.Router(); // 라우터 객체 생성

  // 사용자 ID를 기반으로 프로필 조회 (GET /profile/:id)
  // ※ 인증/인가 없이 접근 가능하여 IDOR(Insecure Direct Object Reference) 공격 가능
  router.get('/:id', async (req, res) => {
    const id = req.params.id; // URL에서 사용자 ID 추출

    try {
      // 해당 ID의 사용자 정보 조회
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      const user = rows[0];
      
      if (user) {
        // 사용자 정보를 profile.ejs 템플릿에 전달하여 렌더링
        res.render('profile', { user });
      } else {
        // 사용자를 찾지 못한 경우 404 응답
        res.status(404).send('사용자를 찾을 수 없습니다.');
      }
    } catch (err) {
      // 쿼리 오류 등의 예외 처리
      res.status(500).send('서버 오류');
    }
  });

  // 라우터 반환
  return router;
}
