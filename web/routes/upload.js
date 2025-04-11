// routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

export default function makeUploadRouter(db) {
  const router = express.Router();

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage });

  router.get('/', (req, res) => {
    res.render('upload', { user: req.session.user || null });
  });

  router.post('/', upload.single('file'), (req, res) => {
    if (!req.session.user) {
      return res.send(`<script>alert('로그인이 필요합니다.'); window.location.href='/login';</script>`);
    }

    const filePath = `/uploads/${req.file.filename}`;

    res.send(`<script>alert('파일 업로드 완료!'); window.location.href='/upload';</script>`);
  });

  return router;
}
