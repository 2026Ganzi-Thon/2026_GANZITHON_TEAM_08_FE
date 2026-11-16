# GANZITHON TEAM 08

React Native + Expo + TypeScript 모바일 앱입니다. Expo Router로 화면을 이동하고 기본 StyleSheet로 스타일을 작성합니다.

## 실행

Node.js LTS와 npm을 사용합니다.

```sh
npm ci
npm start
```

Windows PowerShell 실행 정책 오류가 발생하면 npm 대신 npm.cmd를 사용하세요.

휴대폰에 Expo Go를 설치하고 PC와 같은 Wi-Fi에 연결한 뒤 터미널 QR 코드를 여세요. Expo Go가 프로젝트의 Expo SDK 버전을 지원해야 합니다. 버전이 다르면 호환되는 Expo Go 또는 개발 빌드가 필요합니다.

```sh
npm run android             # Android 에뮬레이터 또는 연결된 개발용 기기
npm run ios                 # iOS 시뮬레이터 (macOS + Xcode 필요)
npm run web                 # 브라우저 확인
npm run typecheck           # TypeScript 검사
npm run check:dependencies  # Expo 패키지 호환성 검사
```

## 구조

- src/app/_layout.tsx: 루트 내비게이션과 테마
- src/app/(tabs)/_layout.tsx: 하단 탭
- src/app/(tabs)/index.tsx: 홈
- src/app/(tabs)/settings.tsx: 설정
- src/app/modal.tsx: 앱 정보 모달
- components/: 공통 컴포넌트
- constants/: 테마 및 상수
- assets/: 이미지와 폰트

@/ 별칭은 프로젝트 루트를 가리킵니다. TypeScript strict 모드와 기기의 라이트/다크 테마를 지원합니다.

## 개발 범위

로그인, DB, 외부 API, 유료 서비스는 아직 연결하지 않았습니다. Expo Go는 개발용 실행 환경이며 독립 설치 APK와는 다릅니다. APK 생성과 스토어 출시는 추후 설정합니다.

환경 변수는 .env에 보관하세요. EXPO_PUBLIC_ 변수는 앱에 포함되어 공개되므로 서버 비밀 키나 비밀번호를 넣으면 안 됩니다.

공식 문서: [Expo 시작하기](https://docs.expo.dev/get-started/create-a-project/), [기기 설정](https://docs.expo.dev/get-started/set-up-your-environment/).


