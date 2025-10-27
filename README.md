# DWGAME - Phaser3 게임 프로젝트

Phaser3 기반 게임 개발 프로젝트입니다.

## 🚀 시작하기

### 개발 서버 실행
```bash
npm run dev
```
브라우저가 자동으로 열리며 `http://localhost:3000`에서 게임을 확인할 수 있습니다.

### 프로덕션 빌드
```bash
npm run build
```

### 빌드 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
DWGAME/
├── src/
│   ├── scenes/          # 게임 씬들
│   │   ├── PreloadScene.js
│   │   └── GameScene.js
│   ├── config.js        # Phaser 설정
│   └── main.js          # 진입점
├── src/assets/
│   ├── images/          # 이미지 파일
│   ├── audio/           # 오디오 파일
│   └── fonts/           # 폰트 파일
├── public/              # 정적 파일
├── index.html           # HTML 템플릿
├── vite.config.js       # Vite 설정
└── package.json
```

## 🛠 기술 스택

- **Phaser 3.90.0** - 게임 엔진
- **Vite 7.1.12** - 빌드 도구
- **ES6 Modules** - 모듈 시스템

## 📝 개발 가이드

### 새로운 씬 추가
1. `src/scenes/` 폴더에 새 씬 파일 생성
2. `src/config.js`의 `scene` 배열에 추가

### 에셋 추가
- 이미지: `src/assets/images/`
- 오디오: `src/assets/audio/`
- 폰트: `src/assets/fonts/`

### 게임 설정 변경
`src/config.js` 파일에서 게임 크기, 물리 엔진, 배경색 등을 수정할 수 있습니다.

## 🎮 기본 기능

- ✅ Phaser3 게임 엔진 설정
- ✅ Vite 개발 서버 및 HMR
- ✅ 씬 시스템 (Preload, Game)
- ✅ Arcade 물리 엔진
- ✅ 반응형 스케일링

## 📦 빌드 결과물

빌드 후 `dist/` 폴더에 최적화된 파일이 생성됩니다.
# DWGAME
