# 가로 스크롤 카드 섹션

HTML, CSS, TypeScript로 구현한 카드 섹션입니다.

## 링크

- GitHub 레포지토리: https://github.com/jihoon8730/hello-front-test
- 구현 페이지: https://jihoon8730.github.io/hello-front-test/

## 실행

```bash
npm install
npm run build
```

`index.html`을 브라우저에서 열면 됩니다. 확인용 정적 서버를 사용할 경우 프로젝트 루트에서 아래 명령을 실행합니다.

```bash
python3 -m http.server 4173
```

## 구조

- `index.html`: 페이지 기본 마크업과 렌더링 영역
- `src/styles.css`: 레이아웃, 반응형, 카드 스타일
- `src/main.ts`: 섹션/카드 데이터, 렌더링 로직, PC 가로 스크롤 전환 로직
- `dist/main.js`: TypeScript 빌드 결과

## 기술 선택

스크롤 위치를 직접 계산해야 하는 요구사항이라 프레임워크 없이 작성했습니다. 외부 라이브러리는 쓰지 않았고, 스크롤 이벤트는 `requestAnimationFrame`으로 묶어 처리했습니다.

## 반응형

PC는 `min-width: 1025px`에서 동작합니다. 카드 섹션이 화면 중앙에 도달하면 sticky 상태가 되고, 세로 스크롤 진행량만큼 카드 트랙이 좌우로 움직입니다.

Tablet/Mobile은 `max-width: 1024px`에서 하나의 구간으로 처리했습니다. 이 구간에서는 가로 전환을 사용하지 않고 카드가 세로로 쌓입니다.

콘텐츠 영역은 최대 `1400px`로 제한했습니다. 좌우 padding은 PC `20px`, Tablet/Mobile `10px`이며, 1400px 콘텐츠 폭 바깥 여백으로 유지되도록 계산했습니다.

## 섹션과 카드 추가

섹션을 추가하려면 `src/main.ts`의 `sections` 배열에 객체를 하나 더 넣으면 됩니다.

카드를 추가하려면 해당 섹션의 `cards` 배열에 객체를 추가하면 됩니다. 가로 이동 거리는 `track.scrollWidth` 기준으로 다시 계산되므로 별도 수치를 수정하지 않아도 됩니다.
