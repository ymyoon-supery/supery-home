# SUPER Y 웹사이트 상용화 체크리스트

## 1. 도메인 연결

- [ ] 도메인 구매 (예: supery.co.kr — 가비아, 후이즈, Namecheap 등)
- [ ] Railway 대시보드 → Settings → Domains → **Custom Domain** 추가
- [ ] 도메인 DNS 설정 (CNAME 또는 A 레코드를 Railway 제공 값으로 변경)
- [ ] HTTPS 자동 발급 확인 (Railway에서 Let's Encrypt 자동 처리)
- [ ] `next.config.ts`의 `openGraph.url` 실제 도메인으로 수정

---

## 2. 환경 변수 최종 점검

Railway → Variables 탭에서 모두 설정됐는지 확인:

| 변수명 | 설명 |
|--------|------|
| `ADMIN_PASSWORD` | 어드민 로그인 비밀번호 (충분히 복잡하게) |
| `ADMIN_SECRET` | 세션 쿠키 서명 키 (랜덤 32자 이상) |
| `JSONBIN_API_KEY` | JSONBin Master Key |
| `JSONBIN_BIN_ID` | JSONBin Bin ID |
| `CLD_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLD_API_KEY` | Cloudinary API Key |
| `CLD_API_SECRET` | Cloudinary API Secret |
| `SMTP_HOST` | 이메일 발송 서버 (예: smtp.gmail.com) |
| `SMTP_PORT` | 포트 (465 또는 587) |
| `SMTP_USER` | 발송 이메일 계정 |
| `SMTP_PASS` | 이메일 앱 비밀번호 |
| `CONTACT_TO` | 문의 수신 이메일 (ymyoon@supery.co.kr) |

---

## 3. 콘텐츠 최종 입력

- [ ] 어드민(`/admin`) 접속 → 모든 프로젝트 이미지·설명 최종 확인
- [ ] 홈 노출 프로젝트 (`featured`) 설정 — 슬라이더·Latest Works에 표시됨
- [ ] About 페이지 실제 회사 소개 텍스트로 교체
- [ ] Contact 페이지 주소·전화번호·지도 정보 업데이트
- [ ] Footer 회사 정보 (주소, 사업자번호 등) 확인
- [ ] 회사소개서 다운로드 링크 연결 (현재 `href="#"`)

---

## 4. SEO 기본 설정

- [ ] `app/layout.tsx` metadata — `title`, `description`, `openGraph.url` 실제 도메인으로 수정
- [ ] `public/` 폴더에 `favicon.ico`, `apple-touch-icon.png` 추가
- [ ] `public/robots.txt` 생성:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://도메인/sitemap.xml
  ```
- [ ] `app/sitemap.ts` 생성 (Next.js 자동 sitemap 생성)
- [ ] Google Search Console 등록 → 사이트맵 제출

---

## 5. 성능 최적화

- [ ] 대표 이미지들 WebP 포맷으로 업로드 (Cloudinary 자동 변환 가능)
- [ ] `next.config.ts`에 Cloudinary 이미지 최적화 설정 추가:
  ```ts
  images: {
    formats: ["image/avif", "image/webp"],
  }
  ```
- [ ] Lighthouse 점수 측정 (Chrome DevTools → Lighthouse) — 목표: 90점 이상
- [ ] 모바일 반응형 최종 확인 (iPhone, Galaxy 등 실기기 테스트)

---

## 6. 보안

- [ ] 어드민 비밀번호 강화 (영문+숫자+특수문자 12자 이상)
- [ ] `ADMIN_SECRET` 환경변수 랜덤값으로 교체:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] `/admin` 경로는 검색엔진 차단 (`robots.txt`에 `Disallow: /admin` 추가)
- [ ] Cloudinary API Secret 외부 노출 여부 확인 (git에 `.env.local` 포함 여부)

---

## 7. 모니터링

- [ ] **Uptime 모니터링**: UptimeRobot (무료) — 사이트 다운 시 이메일 알림
  - https://uptimerobot.com → 모니터 추가 → URL 입력
- [ ] **에러 추적**: Sentry 연동 (선택, 무료 티어 제공)
- [ ] Railway 대시보드에서 메모리·CPU 사용량 주기적 확인

---

## 8. 백업

- [ ] JSONBin 데이터 주기적 백업:
  - 브라우저에서 `https://사이트주소/api/admin/projects` 접속 → JSON 복사 저장
  - 또는 JSONBin 대시보드에서 직접 다운로드
- [ ] Cloudinary 미디어는 Cloudinary 대시보드에서 관리 (자체 백업)
- [ ] GitHub 저장소가 소스코드 백업 역할 수행 중 ✅

---

## 9. 런칭 전 최종 테스트

- [ ] 문의하기 폼 실제 이메일 발송 테스트
- [ ] 프로젝트 추가/수정/삭제 동작 확인
- [ ] 이미지 업로드 10개 제한 동작 확인
- [ ] 라이트/다크 모드 전환 확인
- [ ] 모든 내부 링크 정상 작동 확인
- [ ] 404 페이지 표시 확인

---

## 10. 런칭 후

- [ ] Google Analytics 4 연동 (방문자 통계)
- [ ] Naver 웹마스터 도구 등록 (국내 검색 노출)
- [ ] 소셜미디어 OG 이미지 공유 테스트 (카카오톡·링크드인에 URL 공유 시 미리보기 확인)
- [ ] 정기적인 콘텐츠 업데이트 계획 수립

---

> **현재 배포 주소**: https://superyhome1-production.up.railway.app  
> **GitHub**: https://github.com/ymyoon-supery/supery-home  
> **어드민**: /admin
