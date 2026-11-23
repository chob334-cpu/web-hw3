# web-hw3
# 실습과제 #3 : 살아 움직이는 영화 보드
- 이름 / 학번 : 김경빈 / [2358005]
- 사이트 주소 : https://chob334-cpu.github.io/web-hw3/
- 출발점 : 내 #1, #2 저장소
- 사용한 API : TMDB(포스터, 영화 정보), KOBIS(일별 박스오피스, 기준일 2026-10-30)

## 구현 항목 체크(기능 체크표)
| 요구사항 | 상태 | 한 줄 메모 |
|---|---|---|
| 1 렌더링 | 완료 | `movies` 배열 10건을 `renderCards`로 동적 생성하고 `data-type`, `data-title`, 순위·평점 배지 적용 |
| 2 검색 | 완료 | `#q` 입력창의 `input` 이벤트와 `search()` 함수를 연결해 제목 실시간 필터링 구현 |
| 3 정렬 3종 | 완료 | `sortBy()` 함수로 평점순·최신 개봉순(내림차순) 및 제목 가나다순(오름차순) 정렬 구현 |
| 4 보기 필터와 getView | 완료 | `getView()`에서 검색어, `#typeFilter` 라디오 선택값, 정렬 기준을 순차 조합해 렌더링 |
| 5 찜과 저장 | 완료 | `.board` 이벤트 위임으로 찜 토글 처리 및 `localStorage`(`JSON.stringify`/`parse`)로 새로고침 후에도 유지 |
| 6 빈 결과 | 완료 | 검색·필터 결과가 0건일 때 `.is-empty` 클래스를 부여해 `.state-empty` 안내 문구 출력 |
| 7 상세 대화상자 | 완료 | 카드 클릭 시 `movies.find()`로 데이터를 조회해 `<dialog id="detail">`에 출력하고 `showModal()`/`close()`로 제어 |
| 8 인라인 이벤트 속성 없음, 콘솔 오류 0 | 완료 | HTML 인라인 이벤트 없이 `addEventListener`와 이벤트 위임만 사용했으며 콘솔 오류 0건 확인 |
| 보너스 | TMDB 실시간 검색 | 검색창(`#q`)에서 Enter 입력 시 `fetch`와 `searchTMDB()`로 TMDB 영화 5건을 실시간 조회해 렌더링 |
## 어려웠던 점 3가지와 해결
1. **파일 병합 후 스크립트 로드 순서 및 반복문 변수 참조 오류 (`m is not defined`)**
   - `index.html`에서 `data.js`와 `app.js`의 연결 위치 및 `renderCards` 내 `for...of` 반복문 블록 구조를 점검해 모든 카드 생성 코드가 반복문 안에서 실행되도록 수정하여 해결했습니다.
2. **일부 영화의 TMDB 포스터 경로 오류로 인한 이미지 깨짐**
   - `쇼생크 탈출`, `어바웃 타임` 등 초기 경로가 유효하지 않아 이미지가 로드되지 않던 문제를 TMDB에서 실제 `poster_path`를 재확인·교체하여 해결했습니다.
3. **검색·정렬로 카드가 다시 그려진 뒤에도 찜 상태와 클릭 이벤트 유지**
   - 개별 버튼에 직접 리스너를 다는 대신 부모 요소인 `.board`에 이벤트 위임(`e.target.closest`)을 적용하고, `liked` 배열을 `localStorage`에 저장한 뒤 `refresh()`로 다시 그리도록 구현해 해결했습니다.

## 참고한 자료 (교재 절, MDN 페이지 제목, 검색어)
- 교재 12장 전체 (DOM과 이벤트)
- MDN Web Docs: `Element.closest()`, `Window.localStorage`, `HTMLDialogElement.showModal()`, `EventTarget.addEventListener()`
- TMDB 공식 사이트 및 API 문서 (영화 포스터 경로 및 줄거리 조회)
- 영화진흥위원회 영화관입장권통합전산망(KOBIS) 일별 박스오피스 데이터

## 생성형 AI 사용 내역 (없으면 "없음")
- 질문 요지 : 기존 3개 저장소(`web-hw1`, `web-hw2`, 12주차 실습) 파일 병합 기준 확인, `renderCards`의 `ReferenceError` 및 포스터 경로 오류 원인 파악, `README.md` 양식 정리
- 답변 요약 : 파일별 병합 및 수정 위치 안내, `for...of` 블록 및 유효한 TMDB `poster_path` 점검 방법 제시
- 채택 여부 : 오류 원인 파악 및 요구사항 체크·문서 정리에 참고하고, 안내문 기준에 맞춰 코드를 직접 작성·검증하여 반영