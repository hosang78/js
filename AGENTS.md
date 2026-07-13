# 나만의 대시보드 - 작업 지침 (ChatGPT / Codex용)

비밀번호로 보호된 개인용 Node.js 대시보드. 좌측 메뉴에서 페이지를 선택해 각 js 라이브러리/외부 API 데모를 확인하는 용도. 구조는 `README.md` 참고.

이 저장소는 같은 라이브러리를 Claude와 ChatGPT(Codex)가 각자 따로 데모를 만든다. 아래 규칙만 지키면 서로 파일이 겹치지 않는다.

## 폴더 구조 — Claude/ChatGPT 데모 분리 (탭 구조)

라이브러리 하나당 폴더 구조는 다음과 같다.

```
pages/<라이브러리-slug>/
  meta.json          # { name, description, entry: "index.html", category }
  index.html         # 탭 껍데기 (범용, 슬러그 무관하게 항상 동일한 내용) — 직접 수정하지 않음
  claude/index.html  # Claude가 만드는 데모 — 절대 건드리지 않음
  chatgpt/index.html # ChatGPT/Codex가 만드는 데모 — 여기에만 작성
```

- 탭 껍데기(`pages/<slug>/index.html`)는 `templates/page-shell.html`을 그대로 복사한 파일이다. `claude/index.html`, `chatgpt/index.html` 존재 여부를 런타임에 자동으로 확인해서, 둘 다 있으면 위에 "Claude / ChatGPT" 탭을 보여주고 하나만 있으면 탭 없이 바로 그 데모를 보여준다. **내용을 손댈 필요 없이 그대로 복사만 하면 된다.**
- **ChatGPT/Codex는 `pages/<slug>/claude/` 폴더를 만들거나 수정하지 않는다.** 이미 있으면 그대로 둔다.
- `meta.json`이 이미 존재하면(= Claude가 먼저 만든 라이브러리) 그 내용을 그대로 두고 `chatgpt/index.html`만 추가한다. `meta.json`이 아예 없으면(= 아직 아무도 안 만든 라이브러리) 새로 만든다.

## 라이브러리 이름만 입력했을 때의 기본 동작

사용자가 별도 설명 없이 **라이브러리 이름만** 입력하면(예: "Chart.js", "D3.js"), 아래 규칙대로 새 데모 페이지를 자동으로 만든다.

1. `pages/<라이브러리-slug>/` 폴더 확인
   - 이미 `meta.json`이 있으면(Claude가 먼저 만든 경우) 그대로 두고 재사용한다. `category`도 이미 정해진 값을 그대로 따른다.
   - 없으면 새로 만든다: `meta.json`: `{ "name", "description", "entry": "index.html", "category" }`
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
   - `index.html`(탭 껍데기)이 없으면 `templates/page-shell.html`을 그대로 복사해서 만든다. 이미 있으면 손대지 않는다.
   - `chatgpt/index.html`: 해당 라이브러리의 **핵심 기능 3~5개**를 한 페이지에서 확인할 수 있도록 구성 (실제 데모 내용은 전부 이 파일에 작성)
   - `claude/index.html`이 이미 존재하더라도 참고하거나 베끼지 않는다 — 독립적으로 새로 작성한다.
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
7. 완료 후: 로컬에서 서버 켜서 `/api/pages`에 페이지가 정상 등록되는지, `pages/<slug>/index.html`(탭 껍데기)과 `pages/<slug>/chatgpt/index.html`(실제 데모)이 각각 200으로 응답하는지, 탭 껍데기에서 "ChatGPT" 탭을 눌렀을 때 데모가 정상적으로 iframe에 뜨는지 확인 → git commit & push

## 브랜치/배포

- Claude는 `claude/nodejs-password-protected-app-phjpp3` 브랜치에서 작업한다. ChatGPT/Codex는 별도 브랜치(예: `chatgpt/...`)를 만들어 작업하고, 서로 다른 파일만 건드리므로 병합 시 충돌이 거의 없다.
- Render가 배포 대상 브랜치를 보고 자동 배포함 (push하면 몇 분 내 반영)
- `.env`는 절대 커밋하지 않음 (비밀번호 해시/세션 시크릿은 로컬 `.env` 또는 Render 환경변수로만 관리)
