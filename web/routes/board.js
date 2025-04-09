// routes/board.js - 게시판 기능 구현 (Stored XSS 실습용)

// express 모듈 불러오기
import express from 'express';

// app.js에서 db 객체를 전달받아 라우터 생성
export default function makeBoardRouter(db) {
  const router = express.Router(); // 라우터 객체 생성

  // 게시판 글 목록 조회 (GET /board)
  // 모든 게시글을 작성 시간 역순으로 가져와 board.ejs에 전달
  router.get('/', async (req, res) => {
    const [posts] = await db.query('SELECT * FROM posts ORDER BY createdAt DESC');
    res.render('board', { posts }); // 게시글 목록 렌더링
  });

  // 게시글 작성 처리 (POST /board)
  // 사용자로부터 제목과 내용을 입력받아 posts 테이블에 저장
  // ※ content에는 <script> 태그 등도 필터링 없이 저장됨 → Stored XSS 실습 가능
  router.post('/', async (req, res) => {
    const { title, content } = req.body; // 폼 데이터 추출

    // DB에 게시글 삽입
    await db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);

    // 글 작성 후 게시판 목록으로 리디렉션
    res.redirect('/board');
  });

  router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.redirect('/board');
  });

  // 라우터 반환
  return router;
}
