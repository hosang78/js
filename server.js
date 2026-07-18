require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const { requireAuthPage, requireAuthApi } = require('./middleware/auth');
const { checkLoginLimit, recordLoginFailure, recordLoginSuccess } = require('./middleware/loginLimiter');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!ADMIN_PASSWORD_HASH || !SESSION_SECRET) {
  console.error('ADMIN_PASSWORD_HASH 와 SESSION_SECRET 을 .env 에 설정해주세요. (README 참고)');
  process.exit(1);
}

const PAGES_DIR = path.join(__dirname, 'pages');

// 좌측 메뉴 그룹 순서와 표시 이름 (meta.json의 category 값과 매칭)
const CATEGORY_ORDER = [
  { key: 'chart', label: '차트 · 시각화' },
  { key: 'diagram', label: '다이어그램 · 그래프 구조' },
  { key: 'map', label: '지도 · 위치 데이터' },
  { key: 'datetime', label: '날짜 · 시간' },
  { key: 'data', label: '데이터 처리 · 유틸리티' },
  { key: 'form', label: '폼 · 입력 컨트롤' },
  { key: 'ui', label: 'UI 인터랙션 · 알림' },
  { key: 'canvas', label: '캔버스 · 이미지 · 애니메이션' },
  { key: 'document', label: '문서 · 텍스트 처리' },
  { key: 'etc', label: '기타' },
];

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// 로그인/공용 정적 자원 (css, client js) - 인증 없이 접근 가능
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', checkLoginLimit, async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: '비밀번호를 입력하세요.' });
  }

  const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!ok) {
    recordLoginFailure(req);
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
  }

  recordLoginSuccess(req);
  req.session.authenticated = true;
  res.json({ ok: true });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/', requireAuthPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

// 좌측 메뉴용 페이지 목록 (pages/ 폴더를 스캔해서 meta.json 을 읽음)
app.get('/api/pages', requireAuthApi, (req, res) => {
  if (!fs.existsSync(PAGES_DIR)) {
    return res.json([]);
  }

  const entries = fs
    .readdirSync(PAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  const list = entries
    .map((entry) => {
      const metaPath = path.join(PAGES_DIR, entry.name, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        return {
          slug: entry.name,
          name: meta.name || entry.name,
          entry: meta.entry || 'index.html',
          category: meta.category || 'etc',
        };
      } catch (err) {
        console.error(`meta.json 파싱 실패: ${entry.name}`, err.message);
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  // 카테고리별로 묶어서, 정해진 그룹 순서대로 반환 (그룹 안에서는 이름순)
  const groups = CATEGORY_ORDER.map(({ key, label }) => ({
    category: key,
    label,
    pages: list.filter((page) => page.category === key),
  })).filter((group) => group.pages.length > 0);

  res.json(groups);
});

// 개별 페이지 정적 파일 (iframe 로 로드됨) - 인증 필요
app.use('/pages', requireAuthPage, express.static(PAGES_DIR));

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
