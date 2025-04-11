// routes/login.js
import express from 'express';

export default function makeLoginRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('login');
  });

  router.post('/', async (req, res) => {
    const { userid, password } = req.body;

    try {
      const query = `SELECT * FROM user WHERE userid = '${userid}' AND password = '${password}'`;
      const [rows] = await db.query(query);
      const user = rows[0];

      if (user) {
        req.session.user = user;
        res.redirect('/');
      } else {
        return res.send(`<script>alert('로그인 실패'); window.history.back();</script>`);
      }


    } catch (err) {
      console.error('로그인 에러:', err);
      res.status(500).send('서버 오류 발생');
    }
  });

  return router;
}
