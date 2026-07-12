# 나만의 대시보드

비밀번호로 보호된 개인용 Node.js 대시보드입니다. 왼쪽 메뉴에서 페이지를 선택하면 화면에 로드되고, 하단에 설명이 표시됩니다. 외부 API를 연동하는 HTML/JS 페이지를 계속 추가해나갈 수 있는 구조입니다.

## 로컬 실행

```bash
npm install
npm run hash-password -- "원하는비밀번호"   # 출력된 해시를 복사
cp .env.example .env                        # .env 파일 생성 후 아래 값 채우기
```

`.env` 파일 예시:

```
PORT=3000
ADMIN_PASSWORD_HASH=위에서 생성한 해시 값
SESSION_SECRET=아무 임의의 긴 문자열
```

```bash
npm start
```

`http://localhost:3000` 접속 후 설정한 비밀번호로 로그인합니다.

## Render 배포

1. 이 저장소를 GitHub에 push
2. Render 대시보드 → **New +** → **Web Service** → 이 저장소 선택
3. 설정
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment** 탭에서 환경변수 추가
   - `ADMIN_PASSWORD_HASH` (로컬에서 `npm run hash-password`로 생성한 값)
   - `SESSION_SECRET` (임의의 긴 랜덤 문자열)
   - `NODE_ENV=production`
5. 배포 완료 후 생성된 URL로 휴대폰/PC 어디서든 접속

> Render 무료 플랜은 일정 시간 미사용 시 서버가 잠들었다가 다음 접속 때 다시 켜지는 데 몇 십 초 걸릴 수 있습니다. 정상 동작입니다.

## 새 페이지 추가하는 방법

`pages/` 폴더 아래에 폴더 하나를 새로 만들면 좌측 메뉴에 자동으로 나타납니다.

```
pages/
  내페이지/
    meta.json     ← 메뉴에 표시될 이름
    index.html    ← 실제 페이지 (자유롭게 HTML/CSS/JS 작성, 외부 API 호출 가능, 상단에 간단한 설명 포함 권장)
```

`meta.json` 형식:

```json
{
  "name": "메뉴에 표시될 이름",
  "entry": "index.html"
}
```

서버 재시작 없이, 새로고침만 하면 메뉴에 바로 나타납니다. 예시로 `pages/weather`(Open-Meteo 날씨 조회), `pages/currency`(frankfurter.app 환율 변환)가 포함되어 있으니 참고해서 만들면 됩니다.

### API 키가 필요한 외부 API를 쓰고 싶다면

지금 예시들은 키가 필요 없는 공개 API라 클라이언트 JS에서 바로 호출합니다. 키가 필요한 API를 쓰려면 키를 클라이언트 코드에 절대 넣지 말고, 서버(`server.js`)에 프록시 라우트를 추가해서 서버 쪽 `.env`에 키를 보관하고 클라이언트는 그 라우트만 호출하도록 만들어야 합니다.

## 비밀번호 변경

```bash
npm run hash-password -- "새비밀번호"
```

출력된 해시를 `.env`(로컬) 또는 Render 환경변수의 `ADMIN_PASSWORD_HASH`에 다시 넣고 재배포/재시작하면 됩니다.
