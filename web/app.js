// app.js - SQLite 기반 취약 웹 서버 설정 및 실행

// Express 웹 서버 프레임워크 import
import express from 'express';
// express-session: 로그인 세션 관리를 위한 미들웨어
import session from 'express-session';
// path 관련 모듈: 디렉토리 및 파일 경로 설정에 사용
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// SQLite DB 초기화 함수 import
import { initDB } from './db.js';

// 라우터 import
import makeLoginRouter from './routes/login.js';
import makeRegisterRouter from './routes/register.js';
import makeBoardRouter from './routes/board.js';
import makeProfileRouter from './routes/profile.js';
import makeUploadRouter from './routes/upload.js';

// __filename, __dirname 설정 (ESM 환경에서 직접 생성 필요)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express 앱 객체에 넣어줌.
const app = express();

// MySQL DB 연결 (db 생성 및 테이블 준비)
const db = await initDB();

// ───────────────────────────────
// 미들웨어 설정

// POST 요청에서 form 데이터를 파싱하기 위한 설정
app.use(express.urlencoded({ extended: true }));

// 세션 설정 (로그인 정보 유지 목적)
app.use(session({
  secret: 'secret',            // 세션 암호화 키
  resave: false,                  // 요청마다 세션 재저장 여부
  saveUninitialized: true        // 비어있는 세션도 저장 여부
}));

// ───────────────────────────────
// 뷰 엔진 설정

// EJS 템플릿 사용
app.set('view engine', 'ejs');
// 뷰 파일 경로 설정
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 경로 설정 (/uploads URL로 접근 시 public/uploads 폴더의 파일 제공)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ───────────────────────────────
// 라우터 등록

// 라우터 등록
app.use('/login', makeLoginRouter(db))  // 로그인
app.use('/register', makeRegisterRouter(db))  // 회원가입
app.use('/board', makeBoardRouter(db)); // 게시판 (XSS)
app.use('/profile', makeProfileRouter(db)); // 프로필 (IDOR)
app.use('/upload', makeUploadRouter(db));   // 파일 업로드 (Webshell)

// 메인 페이지 라우팅 추가 (여기 넣기!)
app.get('/', (req, res) => {
    res.render('main');
  });

// ───────────────────────────────
// 서버 시작

app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:3000');
});
