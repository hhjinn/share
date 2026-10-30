// GNB, 푸터 공통 컴포넌트: <owl-gnb page="pricing"></owl-gnb>, <owl-foot></owl-foot>
// page: home | pricing | updates | contact | download (현재 페이지 메뉴 강조, 홈이면 같은 페이지 안 링크)
// head 에서 불러와야 본문을 읽는 즉시 바뀜 (main.js 가 GNB 를 찾기 전)
{
const en = document.documentElement.lang === 'en';
const t = en ? {
  feat: 'Features', price: 'Pricing', res: 'Resources', manual: 'User manual', manualD: 'How to use each feature and connect DBs',
  upd: "What's new", updD: 'New features and changes', onprem: 'On-premises', dl: 'Download', contact: 'Contact us', use: 'Try OwlAI', menu: 'Menu',
  slogan: 'Ask your company data in plain language', product: 'Product', company: 'Company', about: 'About us', policy: 'Policies',
  terms: 'Terms of service', privacy: 'Privacy policy',
  info: [['Company', 'TmaxTibero Co., Ltd.'], ['CEO', '박경희'], ['Business registration no.', '306-86-01745'], ['Address', 'TmaxSoft Tower, 45 Jeongja-il-ro, Bundang-gu, Seongnam-si, Gyeonggi-do']],
  lang: '<a href="index.html" lang="ko">KO</a><span class="on">EN</span>'
} : {
  feat: '기능', price: '요금제', res: '리소스', manual: '사용자 매뉴얼', manualD: '기능별 사용법과 DB 연결 방법',
  upd: '업데이트 소식', updD: '새 기능과 변경 사항', onprem: '구축형', dl: '다운로드', contact: '도입 문의', use: 'OwlAI 사용하기', menu: '메뉴',
  slogan: '우리 회사 데이터, 이제 말로 물어보세요', product: '제품', company: '회사', about: '회사 소개', policy: '정책',
  terms: '이용약관', privacy: '개인정보처리방침',
  info: [['회사명', '㈜티맥스티베로'], ['대표이사', '박경희'], ['사업자등록번호', '306-86-01745'], ['주소', '경기도 성남시 분당구 정자일로 45, 티맥스소프트타워']],
  lang: '<span class="on">KO</span><a href="en.html" lang="en">EN</a>'
};
const feat = p => p === 'home' ? '#features' : 'index.html#features';
const on = (p, k) => p === k ? ' class="on"' : '';

customElements.define('owl-gnb', class extends HTMLElement {
  connectedCallback() {
    const p = this.getAttribute('page');
    this.outerHTML = `<header class="gnb">
  <a href="${p === 'home' ? '#' : 'index.html'}" class="gnb-logo"><img src="img/logo-white.png" alt="OwlAI" width="128" height="32"></a>
  <nav class="gnb-menu">
    <a href="${feat(p)}">${t.feat}</a>
    <a href="pricing.html"${on(p, 'pricing')}>${t.price}</a>
    <div class="has-sub${p === 'updates' ? ' on' : ''}"><button class="sub-btn">${t.res} <img src="img/ic-chev.svg" width="14" height="14" alt=""></button>
      <div class="sub-menu">
        <a href="#"><i><img src="img/r-book-open.svg" width="18" alt=""></i><div><b>${t.manual} <small>↗</small></b><span>${t.manualD}</span></div></a>
        <a href="updates.html"><i><img src="img/r-spark.svg" width="18" alt=""></i><div><b>${t.upd}</b><span>${t.updD}</span></div></a>
      </div>
    </div>
    <a href="#" data-soon>${t.onprem}</a>
    <a href="download.html"${on(p, 'download')}>${t.dl}</a>
  </nav>
  <div class="gnb-right">
    <div class="lang">${t.lang}</div>
    <a href="contact.html" class="btn-ghost${p === 'contact' ? ' on' : ''}">${t.contact}</a>
    <a href="app.html" class="btn-white">${t.use}</a>
    <button class="gnb-burger" aria-label="${t.menu}"><span></span><span></span><span></span></button>
  </div>
</header>`;
  }
});

customElements.define('owl-foot', class extends HTMLElement {
  connectedCallback() {
    const p = this.getAttribute('page'), dl = ['win', 'mac', 'ios', 'android'], os = ['Windows', 'macOS', 'iOS', 'Android'];
    this.outerHTML = `<footer class="foot">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="img/logo.png" width="120" height="30" alt="OwlAI">
        <p>${t.slogan}</p>
        <div class="lang light">${t.lang}</div>
      </div>
      <nav class="foot-nav">
        <div><b>${t.product}</b><a href="${feat(p)}">${t.feat}</a><a href="pricing.html">${t.price}</a><a href="#" data-soon>${t.onprem}</a></div>
        <div><b>${t.dl}</b>${dl.map((d, i) => `<a href="download.html#${d}">${os[i]}</a>`).join('')}</div>
        <div><b>${t.res}</b><a href="#">${t.manual} ↗</a><a href="updates.html">${t.upd}</a></div>
        <div><b>${t.company}</b><a href="#">${t.about} ↗</a><a href="contact.html">${t.contact}</a></div>
        <div><b>${t.policy}</b><a href="#">${t.terms}</a><a href="#">${t.privacy}</a></div>
      </nav>
    </div>
    <div class="foot-info">
      <dl>${t.info.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <p>Copyright (c) 2026. TmaxTibero. All rights reserved.</p>
    </div>
  </div>
</footer>`;
  }
});
}
