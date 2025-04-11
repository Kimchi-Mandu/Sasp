// routes/register.js
import express from 'express';

export default function makeRegisterRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('register');
  });

  router.post('/', async (req, res) => {
    const { userid, password, passwordConfirm, email, phone } = req.body;

    try {
      // 비밀번호 확인 체크
      if (password !== passwordConfirm) {
        return res.send(`<script>alert('비밀번호가 일치하지 않습니다.'); window.history.back();</script>`);
      }

      const [rows] = await db.query('SELECT * FROM user WHERE userid = ? OR email = ?', [userid, email]);

      if (rows.length > 0) {
        const user = rows[0];
        if (user.userid === userid) {
          return res.send(`<script>alert('중복 ID 입니다.'); window.history.back();</script>`);
        }
        if (user.email === email) {
          return res.send(`<script>alert('중복 Email 입니다.'); window.history.back();</script>`);
        }
      }

      await db.query(
        'INSERT INTO user (userid, password, email, phone) VALUES (?, ?, ?, ?)',
        [userid, password, email, phone]
      );

      res.send(`<script>alert('회원가입이 완료되었습니다. 로그인 해주세요.'); window.location.href='/login';</script>`);

    } catch (err) {
      console.error('회원가입 에러:', err);
      res.status(500).send('회원가입 중 오류 발생');
    }
  });

  return router;
}
