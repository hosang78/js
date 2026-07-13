# 나만의 대시보드 - 작업 지침

비밀번호로 보호된 개인용 Node.js 대시보드. 좌측 메뉴에서 페이지를 선택해 각 js 라이브러리/외부 API 데모를 확인하는 용도. 구조는 `README.md` 참고.

## 폴더 구조 — Claude/ChatGPT 데모 분리 (탭 구조)

이 저장소는 같은 라이브러리를 Claude와 ChatGPT(Codex 등)가 각자 따로 데모를 만들어도 파일이 서로 충돌하지 않도록, 라이브러리 하나당 다음 구조를 쓴다.

```
pages/<라이브러리-slug>/
  meta.json          # { name, description, entry: "index.html", category }
  index.html         # 탭 껍데기 (범용, 슬러그 무관하게 항상 동일한 내용) — 직접 수정하지 않음
  claude/index.html  # Claude가 만드는 데모 — Claude는 이 폴더만 씀
  chatgpt/index.html # ChatGPT/Codex가 만드는 데모 — Claude는 이 폴더를 절대 건드리지 않음
```

- 탭 껍데기(`pages/<slug>/index.html`)는 `templates/page-shell.html`을 그대로 복사한 파일이다. `claude/index.html`, `chatgpt/index.html` 존재 여부를 런타임에 자동으로 확인해서, 둘 다 있으면 위에 "Claude / ChatGPT" 탭을 보여주고 하나만 있으면 탭 없이 바로 그 데모를 보여준다.
- **Claude는 `pages/<slug>/chatgpt/` 폴더를 만들거나 수정하지 않는다.** 이미 있으면 그대로 둔다.
- 탭 껍데기 파일 자체는 라이브러리마다 내용이 동일하므로, 새 라이브러리를 만들 때 `templates/page-shell.html`을 그대로 복사해서 쓰면 된다 (내용을 손댈 필요 없음).

## ChatGPT가 만든 데모를 대신 반영하기 (ChatGPT는 이 저장소에 쓰기 권한이 없음)

ChatGPT/Codex는 이 저장소에 직접 push할 권한이 없다. 그래서 사용자가 ChatGPT 채팅에서 받은 데모 코드를
파일로 올리거나 붙여넣고 "chatgpt 폴더에 올려줘" 같은 요청을 하면, Claude가 대신 반영한다.

1. 사용자가 준 코드/파일이 어떤 라이브러리용인지 확인한다 (슬러그가 애매하면 물어본다).
2. **내용을 고치거나 다시 쓰지 않는다** — ChatGPT가 작성한 결과물 그대로 저장하는 것이 목적이다.
   - 스타일이나 구조가 Claude 데모와 달라도 그대로 둔다. 명백한 문법 오류처럼 안 돌아가는 게 확실한
     경우가 아니면 손대지 말고, 손봐야 할 것 같으면 먼저 사용자에게 확인한다.
3. `pages/<slug>/` 폴더 확인
   - 이미 있으면(Claude가 먼저 만든 라이브러리) `meta.json`과 `claude/`는 그대로 두고 손대지 않는다.
   - 없으면 새로 만든다: `meta.json`(`category`는 위 목록에서 라이브러리 성격에 맞게 선택), 그리고
     `templates/page-shell.html`을 그대로 복사해 `index.html`(탭 껍데기)을 만든다.
4. 받은 내용을 `pages/<slug>/chatgpt/index.html`에 저장한다. 이미지·번들 등 딸린 파일이 있으면 같은
   `chatgpt/` 폴더 안에 상대경로가 유지되도록 같이 저장한다.
5. 완료 후: 로컬 서버로 `pages/<slug>/index.html`을 열어서 "Claude / ChatGPT" 탭이 정상적으로 뜨는지,
   ChatGPT 탭을 눌렀을 때 방금 올린 데모가 iframe에 정상 렌더링되는지 확인 → git commit & push
   (커밋 메시지에 ChatGPT가 작성한 내용을 대신 반영한 것임을 명시)

## 라이브러리 이름만 입력했을 때의 기본 동작

사용자가 별도 설명 없이 **라이브러리 이름만** 입력하면(예: "Chart.js", "D3.js"), 아래 규칙대로 새 데모 페이지를 자동으로 만든다.

1. `pages/<라이브러리-slug>/` 폴더 생성 (이미 있으면 재사용)
   - `meta.json`: `{ "name", "description", "entry": "index.html", "category" }` — 이미 있으면 그대로 둠
   - `index.html`: 위 "폴더 구조" 절 참고 — `templates/page-shell.html`을 그대로 복사 (이미 있으면 그대로 둠)
   - `category`는 좌측 메뉴 그룹핑에 쓰이며 아래 값 중 라이브러리 성격에 가장 맞는 것 하나를 고른다 (없으면 `server.js`의 `CATEGORY_ORDER`에 새 그룹을 추가할지 검토):
     - `chart` 차트 · 시각화
     - `diagram` 다이어그램 · 그래프 구조
     - `map` 지도 · 위치 데이터
     - `datetime` 날짜 · 시간
     - `data` 데이터 처리 · 유틸리티
     - `form` 폼 · 입력 컨트롤
     - `ui` UI 인터랙션 · 알림
     - `canvas` 캔버스 · 이미지 · 애니메이션
     - `document` 문서 · 텍스트 처리
   - `claude/index.html`: 해당 라이브러리의 **핵심 기능 3~5개**를 한 페이지에서 확인할 수 있도록 구성 (실제 데모 내용은 전부 이 파일에 작성)
2. 페이지 상단에 간단한 설명자료 포함 (대시보드 사이드바에는 별도 설명 영역이 없으므로, 설명은 항상 페이지 본문 상단에 넣는다)
   - 라이브러리가 뭘 하는 도구인지 2~3줄 소개
   - 핵심 특징 bullet 목록 (2~4개)
   - 이 페이지에서 **다른 외부 라이브러리/API를 같이 썼다면 반드시 명시** (예: "Chart.js 외에 OO API도 사용")
3. 각 기능 섹션은
   - 소제목 + 1~2줄 용도 설명
   - 실제 동작하는 예시 (렌더링 결과)
   - `<details>`로 접을 수 있는 소스 코드 보기
4. 예시 데이터는 가능하면 **수협중앙회/수산업 테마** 샘플로 구성 (어획, 위판, 조합원, 유통 등)
   - 단, 실제 통계/조직/절차가 아닌 **가상의 예시**임을 페이지에 눈에 띄게 명시 (실존 기관 사칭/오인 방지)
5. 과도하게 복잡한 구현은 피한다 — 목적은 "해당 라이브러리의 핵심 기능 파악"이지 실전 프로덕션 구현이 아님
6. 외부 라이브러리는 CDN으로 클라이언트에서 바로 로드 (가능하면 버전을 고정해서 pin)
   - API 키가 필요한 외부 API를 쓰게 되는 경우에는 클라이언트에 키를 노출하지 말고 `server.js`에 프록시 라우트를 추가할지 먼저 물어본다
7. 완료 후: 로컬에서 서버 켜서 `/api/pages`에 새 페이지가 정상 등록되는지, `pages/<slug>/index.html`(탭 껍데기)과 `pages/<slug>/claude/index.html`(실제 데모)이 각각 200으로 응답하는지, 탭 껍데기가 claude 데모를 정상적으로 iframe에 띄우는지 확인 → git commit & push (현재 작업 브랜치로)

## 브랜치/배포

- 작업 브랜치: `claude/nodejs-password-protected-app-phjpp3`
- Render가 이 브랜치를 보고 자동 배포함 (push하면 몇 분 내 반영)
- `.env`는 절대 커밋하지 않음 (비밀번호 해시/세션 시크릿은 로컬 `.env` 또는 Render 환경변수로만 관리)
