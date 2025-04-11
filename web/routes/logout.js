// routes/logout.js
import express from 'express';

export default function makeLogoutRouter() {
const router = express.Router();

router.get('/', (req, res) => {
req.session.destroy(err => {
if (err) {
console.error('로그아웃 에러:', err);
}
res.send(`<script>alert('로그아웃 되었습니다.'); window.location.href='/';</script>`);
});
});

return router;
}