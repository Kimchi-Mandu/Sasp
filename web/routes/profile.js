// routes/profile.js
import express from 'express';

export default function makeProfileRouter(db) {
  const router = express.Router();

  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!req.session.user) {
      return res.send(`<script>alert('로그인이 필요합니다.'); window.location.href='/login';</script>`);
    }

    try {
      const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
      const [users] = await db.query('SELECT * FROM user');
      const user = rows[0];

      if (!user) {
        return res.status(404).send('사용자를 찾을 수 없습니다.');
      }

      res.render('profile', { user,users });
      
    } catch (err) {
      console.error('프로필 조회 에러:', err);
      res.status(500).send('서버 오류');
    }
  });

  return router;
}
