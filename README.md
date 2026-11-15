# 홍천 비발디파크 1박 2일 여행 가이드

## GitHub Pages에 올리기

1. GitHub에 공개 저장소를 만들고, 이 압축 파일을 풀어 `docs` 폴더를 저장소의 `main` 브랜치에 올립니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Source**에서 **Deploy from a branch**를 선택합니다.
4. **Branch**를 `main`, 폴더를 `/docs`로 선택하고 **Save**를 누릅니다.
5. 배포가 완료되면 **Visit site** 링크를 공유합니다. 일반 프로젝트 저장소의 주소는 `https://<계정>.github.io/<저장소>/`입니다. 주소 뒤에 `#schedule`을 붙이면 일정 섹션으로 바로 이동합니다.

## 내용 수정

- 일정, 식사, 방문일은 `docs/index.html`에 있습니다. 숙소와 식당은 미정으로 표기했습니다.
- 색상과 레이아웃은 `docs/style.css`에서 바꿀 수 있습니다.
- 배너 사진은 `docs/winter-resort.webp`입니다. 여행지를 연상시키는 생성 이미지입니다.
- 날씨는 `docs/weather.js`가 Open-Meteo를 조회합니다. 여행지가 바뀌면 파일의 위도, 경도를 바꾸세요. 별도 서버나 API 키 없이 이용할 수 있습니다.
