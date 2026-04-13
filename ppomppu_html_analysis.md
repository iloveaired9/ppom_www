# ppomppu.co.kr HTML 구조 개선점 분석 보고서

> 분석 일시: 2026-04-09  
> 분석 대상: https://www.ppomppu.co.kr  

---

## 분석 개요

실제 브라우저(Chrome)를 통해 DOM을 직접 쿼리하여 수집한 데이터를 기반으로 작성되었습니다.  
전반적으로 2010년대 초반 스타일의 레거시 HTML 구조가 다수 잔존하며, **SEO · 접근성 · 성능** 세 측면 모두에서 현대 웹 표준과 격차가 확인되었습니다.

---

## 1. 문자 인코딩 — EUC-KR 사용 중

현재 `charset="euc-kr"`을 사용하고 있습니다.  
EUC-KR은 한글 전용 레거시 인코딩으로, 다국어 지원 불가, 일부 특수문자 깨짐, 현대 브라우저 및 툴과의 호환성 문제를 야기합니다.

```html
<!-- 현재 -->
<meta charset="euc-kr">

<!-- 개선 -->
<meta charset="UTF-8">
```

> **영향 범위:** 호환성 전반

---

## 2. 시맨틱 구조 — `<main>`, `<footer>` 태그 누락

| 태그 | 현황 |
|------|------|
| `<header>` | ✅ 사용 중 |
| `<nav>` | ✅ 사용 중 |
| `<main>` | ❌ 없음 |
| `<footer>` | ❌ 없음 (`.footer` 클래스 div로 대체) |
| `<article>`, `<section>`, `<aside>` | ❌ 없음 |

전체 레이아웃이 `div.wrapper > div.sidebar + div.contents` 구조로 되어 있고, 콘텐츠 영역 전체에 시맨틱 태그가 사용되지 않습니다.  
스크린리더와 검색엔진이 콘텐츠 구조를 파악하지 못합니다.

```html
<!-- 현재 -->
<div class="wrapper">
  <div class="sidebar">...</div>
  <div class="contents">...</div>
</div>
<div class="footer">...</div>

<!-- 개선 -->
<div class="wrapper">
  <aside class="sidebar">...</aside>
  <main class="contents">...</main>
</div>
<footer class="footer">...</footer>
```

> **영향 범위:** SEO, 접근성

---

## 3. 헤딩 계층 구조 — H1, H2 전무

현재 메인 페이지에 `<h1>`, `<h2>` 태그가 단 하나도 없고, `<h3>` 1개만 존재합니다.  
페이지 제목 계층이 완전히 붕괴된 상태로, SEO와 접근성 모두에 심각한 영향을 줍니다.

```html
<!-- 개선 예시 -->
<h1 class="visually-hidden">뽐뿌 - 핫딜 커뮤니티</h1>
<h2>오늘의 핫딜</h2>
<h2>최신 게시글</h2>
```

> **영향 범위:** SEO, 접근성

---

## 4. 이미지 접근성 — alt 속성 누락 및 공백

전체 이미지 중 `alt` 속성이 없거나 비어있는 이미지가 다수 확인되었습니다.  
스크린리더 사용자가 이미지 내용을 전혀 파악할 수 없으며, 이미지 검색 노출에도 불리합니다.

```html
<!-- 현재 -->
<img src="...banner.jpg">

<!-- 의미 있는 이미지 -->
<img src="...banner.jpg" alt="삼성 갤럭시 S25 특가 이벤트 배너">

<!-- 장식용 이미지 -->
<img src="...deco.png" alt="" role="presentation">
```

> **영향 범위:** 접근성, SEO

---

## 5. 구식 `<font>` 태그 — 26개 사용 중

`<font>` 태그는 HTML5에서 공식 폐기(deprecated)된 태그입니다.  
현재 26개가 페이지에 잔존하며, 모두 CSS로 대체해야 합니다.

```html
<!-- 현재 -->
<font size="2" color="#333">텍스트</font>

<!-- 개선 -->
<span class="text-small text-dark">텍스트</span>
```

> **영향 범위:** 유지보수, 표준 준수

---

## 6. 보안 — `target="_blank"` 링크에 rel 속성 누락

`target="_blank"`가 적용된 링크 2개 모두 `rel="noopener noreferrer"`가 없습니다.  
이는 열린 탭에서 부모 페이지를 조작할 수 있는 **Tabnapping 취약점**에 해당합니다.

```html
<!-- 현재 -->
<a href="..." target="_blank">외부 링크</a>

<!-- 개선 -->
<a href="..." target="_blank" rel="noopener noreferrer">외부 링크</a>
```

> **영향 범위:** 보안

---

## 7. JavaScript 로딩 — 렌더 블로킹 스크립트

사이트 핵심 JS 파일들(`default3.js`, `jquery-1.11.2.min.js` 등)이 `defer`/`async` 없이 `<head>` 또는 `<body>` 상단에서 로드됩니다.  
HTML 파싱이 중단되어 **초기 렌더링 속도가 저하**됩니다.

```html
<!-- 현재 -->
<script src="jquery-1.11.2.min.js"></script>
<script src="default3.js"></script>

<!-- 개선 -->
<script src="jquery-1.11.2.min.js" defer></script>
<script src="default3.js" defer></script>
```

### jQuery 버전 노후화

현재 **jQuery 1.11.2 (2014년 릴리즈)** 를 사용 중입니다.  
보안 취약점이 다수 패치된 최신 버전(3.x) 업그레이드 또는 Vanilla JS 전환을 권장합니다.

> **영향 범위:** 성능, 보안

---

## 8. SEO — 핵심 메타 태그 누락

| 항목 | 현황 |
|------|------|
| `canonical` | ❌ 없음 |
| `twitter:card` | ❌ 없음 |
| `og:title` | ✅ (단, 내용이 단순히 "뽐뿌") |
| `robots` | ❌ 없음 |
| JSON-LD 구조화 데이터 | ❌ 없음 |
| `hreflang` | ❌ 없음 |

특히 구조화 데이터(JSON-LD)가 전혀 없어 Google 리치 스니펫(가격, 리뷰, 이벤트 등)을 활용하지 못하고 있습니다.

```html
<!-- canonical 추가 예시 -->
<link rel="canonical" href="https://www.ppomppu.co.kr/">

<!-- Twitter 카드 추가 예시 -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@ppomppu">

<!-- JSON-LD 구조화 데이터 예시 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "뽐뿌",
  "url": "https://www.ppomppu.co.kr"
}
</script>
```

> **영향 범위:** SEO, 소셜 미디어 공유

---

## 9. 이미지 성능 — lazy loading 및 크기 속성 미사용

`loading="lazy"` 속성을 사용하는 이미지가 없고, `width`/`height` 속성도 대부분 누락되어 있습니다.  
이는 **CLS(Cumulative Layout Shift)** 점수를 낮추고 뷰포트 밖의 이미지를 불필요하게 미리 다운로드하게 만듭니다.

```html
<!-- 현재 -->
<img src="banner.jpg">

<!-- 개선 -->
<img src="banner.jpg" alt="..." width="300" height="200" loading="lazy">
```

> **영향 범위:** 성능(Core Web Vitals)

---

## 10. 인라인 스타일 과잉 — 119개

119개 요소에 `style=""` 인라인 스타일이 직접 적용되어 있습니다.  
유지보수가 어렵고, CSP(Content Security Policy) 정책 적용을 방해하며, 브라우저 캐싱 혜택도 받지 못합니다.

```html
<!-- 현재 -->
<div style="margin-top:10px; color:#555; font-size:13px;">...</div>

<!-- 개선 -->
<div class="content-item">...</div>
/* CSS */
.content-item { margin-top: 10px; color: #555; font-size: 13px; }
```

> **영향 범위:** 유지보수, 보안(CSP)

---

## 11. ARIA 랜드마크 — role 속성 미사용

현재 `role="main"`, `role="contentinfo"`, `role="search"` 등의 ARIA 랜드마크가 전혀 없습니다.  
시맨틱 태그 보완과 함께 ARIA role을 추가하면 스크린리더 사용자의 탐색 경험이 크게 향상됩니다.

```html
<!-- 개선 예시 -->
<div class="search-area" role="search" aria-label="게시글 검색">
  <input type="search" aria-label="검색어 입력">
</div>
```

> **영향 범위:** 접근성(WCAG)

---

## 우선순위 종합 요약

| 우선순위 | 항목 | 영향 범위 |
|:--------:|------|-----------|
| 🔴 긴급 | `<main>`, `<footer>` 시맨틱 태그 추가 | SEO + 접근성 |
| 🔴 긴급 | H1/H2 헤딩 계층 구조 복원 | SEO + 접근성 |
| 🔴 긴급 | EUC-KR → UTF-8 인코딩 전환 | 호환성 |
| 🟠 높음 | `<font>` 태그 26개 → CSS 대체 | 유지보수 |
| 🟠 높음 | `target="_blank"` 보안 rel 속성 추가 | 보안 |
| 🟠 높음 | JS `defer`/`async` 적용 | 성능 |
| 🟡 중간 | 이미지 `alt` 속성 전면 정비 | 접근성 |
| 🟡 중간 | `lazy loading` + 이미지 크기 명시 | 성능 |
| 🟡 중간 | `canonical`, JSON-LD 구조화 데이터 추가 | SEO |
| 🟢 낮음 | 인라인 스타일 → CSS 클래스화 | 유지보수 |
| 🟢 낮음 | jQuery 1.11.2 → 최신 버전 업그레이드 | 성능/보안 |

---

*분석 도구: Chrome DevTools + DOM Query (JavaScript)*
