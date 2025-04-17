import express from 'express';

export default function makeBoardRouter(db) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [board] = await db.query('SELECT id, author, title, created_at FROM board ORDER BY created_at DESC');
      res.render('board', { board, user: req.session.user });
    } catch (err) {
      console.error('게시판 조회 에러:', err);
      res.status(500).send('게시판 조회 중 오류 발생');
    }
  });

  router.post('/', async (req, res) => {
    if (!req.session.user) {
      return res.send(`<script>alert('로그인이 필요합니다.'); window.location.href='/login';</script>`);
    }

    const { title, content } = req.body;
    const author = req.session.user.userid;

    try {
      await db.query(
        'INSERT INTO board (author, title, content, created_at) VALUES (?, ?, ?, NOW())',
        [author, title, content]
      );
      res.redirect('/board');
    } catch (err) {
      console.error('게시글 작성 에러:', err);
      res.status(500).send('게시글 작성 중 오류 발생');
    }
  });

  // 게시글 상세 보기 라우트 추가
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db.query('SELECT * FROM board WHERE id = ?', [id]);
      const post = rows[0];

      if (!post) {
        return res.status(404).send('게시글을 찾을 수 없습니다.');
      }

      res.render('boardDetail', { post });
    } catch (err) {
      console.error('게시글 상세 조회 에러:', err);
      res.status(500).send('게시글 조회 중 오류 발생');
    }
  });



  router.get('/delete/:id', async (req, res) => {
    const { id } = req.params

    try {
      // 삭제하려는 글의 작성자 조회
      const [rows] = await db.query('SELECT author FROM board WHERE id = ?', [id]);
      const findAuthor = rows[0];

      if (findAuthor.author !== req.session.user.userid) {
        return res.send(`<script>alert('본인의 글만 삭제할 수 있습니다.'); window.location.href='/board';</script>`);
      }

      // 삭제 수행
      await db.query('DELETE FROM board WHERE id = ?', [id]);
      res.redirect('/board');
    } catch (err) {
      console.error('게시글 삭제 에러:', err);
      res.status(500).send('게시글 삭제 중 오류 발생');
    }
  });

  return router;
} 