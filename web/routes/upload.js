// routes/upload.js - 파일 업로드 기능 구현 (Webshell 실습용)

import express from 'express';             // Express 웹 프레임워크 불러오기
import multer from 'multer';               // 파일 업로드 처리를 위한 미들웨어
import path from 'path';                   // 경로 처리를 위한 Node.js 내장 모듈
import { fileURLToPath } from 'url';       // ES 모듈 환경에서 __filename 대체
import { dirname } from 'path';            // 디렉토리 경로 추출용

// __filename과 __dirname 정의 (ES 모듈에서는 기본 제공되지 않기 때문에 직접 설정 필요)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 실제 파일이 저장될 디렉토리 설정 (public/uploads → 정적 경로에 저장됨)
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// 라우터 함수 export: app.js에서 db를 주입하여 사용
export default function makeUploadRouter(db) {
  const router = express.Router(); // 라우터 객체 생성

  // multer 스토리지 설정 (디스크 저장 방식)
  const storage = multer.diskStorage({
    // destination: 업로드한 파일을 저장할 폴더 지정
    destination: (req, file, cb) => {
      cb(null, uploadDir); // 정적 경로에 저장됨 (Webshell 실습 가능 포인트)
    },

    // filename: 저장될 파일명을 정의 (원본 이름 그대로 저장)
    // 보안상 위험하지만 실습 목적상 그대로 둠
    filename: (req, file, cb) => {
      cb(null, file.originalname); // 예: shell.php, xss.html 등
    }
  });

  // multer 인스턴스 생성 (파일 필터링, 사이즈 제한 등 없음 → 의도적 취약점)
  const upload = multer({ storage });

  // [GET] 업로드 페이지 렌더링
  // 사용자가 파일을 선택할 수 있는 HTML 폼이 포함된 upload.ejs 반환
  router.get('/', (req, res) => {
    res.render('upload'); // views/upload.ejs 템플릿 렌더링
  });

  // [POST] 파일 업로드 처리
  // - form의 input name="file"에 해당하는 단일 파일을 처리함
  // - MIME 타입 검사, 확장자 필터링 없음 → Webshell 업로드 실습 가능
  router.post('/', upload.single('file'), (req, res) => {
    // 업로드된 파일 경로를 사용자에게 링크 형태로 반환
    const filePath = `/uploads/${req.file.filename}`; // 정적 경로로 접근 가능 (공격 가능)
    res.send(`파일 업로드 완료: <a href="${filePath}">${filePath}</a>`); // 업로드 결과 출력
  });

  // 구성 완료된 라우터 객체 반환
  return router;
}
