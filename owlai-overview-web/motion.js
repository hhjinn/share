// 모션 (Figma 모션 명세 2393:3, overview-motion 프로토타입 값). ?motion=0 이면 아무것도 하지 않아 정적 화면 그대로
// 시안 검토용이라 OS 의 동작 줄이기 설정과 상관없이 켠다. 실제 사이트는 prefers-reduced-motion 을 따른다 (모션 명세 참고)
// ponytail: 히어로 입력창이 답변 화면으로 날아가는 장면(H15)과 고정 구간(S2-0 pin)은 빠짐. 답변 화면이 다 펴지면 대화가 재생됨
(() => {
if (/[?&]motion=0/.test(location.search)) return;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const isEn = document.documentElement.lang === 'en', wait = ms => new Promise(r => setTimeout(r, ms));
document.documentElement.classList.add('mo');
// 이미 지나친 요소(앵커 이동, 새로고침 뒤 위치 복원)도 나타나게 함
const seen = (el, fn) => { const o = new IntersectionObserver(es => { if (es[0].isIntersecting || es[0].boundingClientRect.bottom < 0) { o.disconnect(); fn(); } }, { rootMargin: '0px 0px -8% 0px' }); o.observe(el); };
function reveal(el, delay) {
  el.classList.add('rv'); el.style.transitionDelay = delay + 's'; el.style.setProperty('--ld', delay + 's');
  seen(el, () => { el.classList.add('vis'); setTimeout(() => el.style.transitionDelay = '', 1600 + delay * 1000); });
}

// 히어로 켜짐 장식
const hero = $('.hero'), beams = $$('.hero .beam');
beams[0]?.classList.add('l'); beams[1]?.classList.add('r');
$('.hero img[src*="h-bloom"]')?.classList.add('h-bloom');
$('.hero img[src*="h-floor"]')?.classList.add('h-floor');
$('.hero .horizon')?.insertAdjacentHTML('beforebegin', '<div class="floor"><div class="plane"></div></div>');
$$('.dots i').forEach(i => { i.style.setProperty('--a', i.style.opacity); i.style.setProperty('--t', (2 + Math.random() * 4).toFixed(1) + 's'); i.style.setProperty('--dl', -(Math.random() * 5).toFixed(1) + 's'); });
hero.insertAdjacentHTML('afterbegin', '<div class="spot"></div>');
hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', e.clientX - r.left + 'px'); hero.style.setProperty('--my', e.clientY - r.top + 'px'); });

// 히어로 등장: 배지, 헤드라인 단어, 부제, 입력창, 안내 순서 (0.85s 뒤 0.1s 간격)
const h1 = $('.hero h1');
h1.innerHTML = h1.innerHTML.split(/(<br>|<em>.*?<\/em>|\s+)/).map(p => !p || /^\s+$/.test(p) || p === '<br>' ? p : `<span class="w">${p}</span>`).join('');
[$('.chip-dark'), ...$$('.w', h1), $('.hero-sub'), $('.prompt'), $('.hero-note')].forEach((el, i) => reveal(el, .85 + (i + 1) * .1));

// 입력창: 질문을 치고 보내면 아래로 답변 카드가 열림 (글자당 60ms, 6.6s 주기)
const QA = isEn ? [
  { q: 'Compare sales by region for last quarter', t: 'Compared sales by region. The Capital area is highest.', r: 'sales_summary',
    sql: "SELECT region, SUM(amount) FROM sales_summary WHERE quarter = '2026-Q3' GROUP BY region", l: ['Capital', 'Yeongnam', 'Chungcheong', 'Honam', 'Gangwon'], v: [100, 76, 58, 44, 30], hi: 0 },
  { q: "Show this month's new customer trend", t: 'New customers are growing every week this month.', r: 'customers',
    sql: "SELECT week, COUNT(*) FROM customers WHERE joined_at >= '2026-10-01' GROUP BY week", l: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], v: [42, 58, 71, 96], hi: 3 },
  { q: 'Top 5 products by return rate', t: 'A-120 has the highest return rate.', r: 'returns',
    sql: 'SELECT product, return_rate FROM returns ORDER BY return_rate DESC LIMIT 5', l: ['A-120', 'B-310', 'C-045', 'A-077', 'D-210'], v: [100, 83, 71, 62, 55], hi: 0 },
] : [
  { q: '지난 분기 지역별 매출을 비교해줘', t: '지역별 매출을 비교했습니다. 수도권이 가장 높습니다.', r: 'sales_summary',
    sql: "SELECT region, SUM(amount) FROM sales_summary WHERE quarter = '2026-Q3' GROUP BY region", l: ['수도권', '영남권', '충청권', '호남권', '강원권'], v: [100, 76, 58, 44, 30], hi: 0 },
  { q: '이번 달 신규 고객 추이를 보여줘', t: '이번 달 신규 고객이 매주 늘고 있습니다.', r: 'customers',
    sql: "SELECT week, COUNT(*) FROM customers WHERE joined_at >= '2026-10-01' GROUP BY week", l: ['1주', '2주', '3주', '4주'], v: [42, 58, 71, 96], hi: 3 },
  { q: '제품별 반품률 상위 5개 알려줘', t: '반품률이 가장 높은 제품은 A-120입니다.', r: 'returns',
    sql: 'SELECT product, return_rate FROM returns ORDER BY return_rate DESC LIMIT 5', l: ['A-120', 'B-310', 'C-045', 'A-077', 'D-210'], v: [100, 83, 71, 62, 55], hi: 0 },
];
const prompt = $('.prompt'), typing = $('.hero .typing'), aura = $('.prompt-aura'), send = $('.prompt .send'), note = $('.hero-note'), tags = $$('.prompt .tag');
prompt.insertAdjacentHTML('beforeend', `<div class="hans"><div class="hans-l"><div class="hans-t"><b>✦</b><span></span></div><div class="hans-s"><span></span><i class="caret"></i></div><div class="hans-r">${isEn ? 'Source' : '근거'}<b></b></div></div><div class="hans-c"></div></div>`);
const hans = $('.hans');
const typeInto = async (el, s, ms) => { for (let i = 1; i <= s.length; i++) { el.textContent = s.slice(0, i); await wait(ms); } };
const lit = (i, ms = 900) => { tags[i]?.classList.add('lit'); setTimeout(() => tags[i]?.classList.remove('lit'), ms); };
function openAns(d) {
  $('.hans-t span').textContent = d.t; $('.hans-r b').textContent = d.r; $('.hans-s span').textContent = '';
  $('.hans-c').innerHTML = d.v.map((v, i) => `<div><i class="${i === d.hi ? 'hi' : ''}"></i><span>${d.l[i]}</span></div>`).join('');
  note.classList.add('hide'); hans.classList.add('open');
  setTimeout(() => { $$('.hans-c i').forEach((b, i) => setTimeout(() => b.style.height = d.v[i] + '%', i * 90)); lit(2, 1400); }, 350);
  setTimeout(() => { lit(3, 2200); typeInto($('.hans-s span'), d.sql, 22); }, 900);
}
setTimeout(() => aura.classList.add('on'), 2600);
(async () => {
  await wait(3200);
  for (let qi = 0; ; qi++) {
    const d = QA[qi % QA.length];
    typing.classList.remove('ph'); typing.textContent = ''; lit(0); lit(1); aura.classList.add('typing');
    await typeInto(typing, d.q, 60); await wait(700);
    send.classList.remove('go'); void send.offsetWidth; send.classList.add('go');
    aura.classList.remove('typing'); aura.classList.add('sent'); setTimeout(() => aura.classList.remove('sent'), 1400);
    await wait(450); openAns(d); await wait(5150);
    hans.classList.remove('open'); note.classList.remove('hide');
    typing.classList.add('ph'); typing.textContent = isEn ? 'Ask OwlAI anything' : 'OwlAI에게 무엇이든 물어보세요'; await wait(1000);
  }
})();

// 섹션 등장 (부모 안 순서대로 0.09s 간격, 제목은 위에서 드러남)
const RV = ['.head>*', '.job-head>.lead', '.db-support', '.steps>*', '.flow', '.ftabs', '.fpanels', '.more-h', '.mcard', '#jobs', '.sec-head-r', '.flowbox', '.scard', '.cmp',
  '.price-l>*', '.price-btns', '.faq-l>*', '.faq-list details', '.cta>h2', '.cta>p', '.cta-input', '.cta-link', '.foot-top', '.foot-info'];
const rvs = $$(RV.join(','));
rvs.forEach(el => { if (el.matches('h2')) el.classList.add('ttl'); el.classList.add('rv'); });
rvs.forEach(el => reveal(el, [...el.parentNode.children].filter(c => c.classList.contains('rv')).indexOf(el) * .09));

// S2 답변 화면: 대화 순서 (지연 ms x 0.65)
const sc = $('.showcase-sec'), app = $('.showcase .app'), [sqlCard, evid, share, dbCard] = $$('.showcase .fcard');
const st = $('.showcase .ans-head span'), dot = $('.g', st), stDone = st.lastChild.textContent, stWait = isEn ? 'Querying the connected DB (sales)' : '연결된 DB(sales)에서 조회 중';
(function wrap(el) { [...el.childNodes].forEach(n => { if (n.nodeType !== 3) return wrap(n); const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) return f.append(w); const s = document.createElement('span'); s.className = 'aw'; s.textContent = w; f.append(s); }); n.replaceWith(f); }); })($('.showcase .ans-text'));
const items = ['.bubble', '.app-recent', '.ans-head span', '.sqlbtn', '.chart', '.sugg span'].flatMap(s => $$(s, app));
items.forEach(e => e.classList.add('a-it'));
const bars = $$('.bars i', app); bars.forEach(b => b.dataset.h = b.style.height);
const cards = $$('.showcase .fcard');
cards.forEach(c => { c.classList.add('bob'); c.style.setProperty('--bt', (6 + Math.random() * 3).toFixed(1) + 's'); c.dataset.sp = (.06 + Math.random() * .1).toFixed(3); });
let pid = 0, played = false;
const show = (...els) => els.forEach(e => e?.classList.add('show'));
function playApp() {
  const my = ++pid, at = (ms, fn) => setTimeout(() => my === pid && fn(), ms * .65);
  at(0, () => show($('.bubble', app)));
  at(200, () => show($('.app-recent', app)));
  at(450, () => { show(st, dbCard); dbCard?.classList.add('ping'); });
  at(1150, () => { dot.classList.remove('wait'); st.lastChild.textContent = stDone; show($('.sqlbtn', app), sqlCard); });
  $$('.aw', app).forEach((w, i) => at(1400 + i * 45, () => show(w)));
  at(1850, () => show($('.chart', app)));
  bars.forEach((b, i) => at(2000 + i * 90, () => b.style.height = b.dataset.h));
  at(2550, () => show($('.labels', app), evid));
  $$('.sugg span', app).forEach((c, i) => at(2750 + i * 80, () => show(c)));
  at(3050, () => show(share));
}
function resetApp() {
  pid++; $$('.show', sc).forEach(e => e.classList.remove('show')); dbCard?.classList.remove('ping');
  dot.classList.add('wait'); st.lastChild.textContent = stWait; bars.forEach(b => b.style.height = '0');
}
resetApp();

// 물결선 16개: 시간에 따라 천천히 출렁임
const wv = $('#waves');
wv.innerHTML = `<svg viewBox="0 0 1440 200" preserveAspectRatio="none">${[...Array(16)].map((_, i) => `<path stroke="rgba(0,39,84,${(.10 + i * .006).toFixed(3)})"/>`).join('')}</svg>`;
const paths = $$('path', wv);
function wave(t) {
  paths.forEach((p, i) => {
    const A = 70 + 4 * i, s = Math.sin(t * .00035 + i * .18), c = Math.cos(t * .00028 + i * .12), a = 34 + 6.35 * i;
    p.setAttribute('d', `M0 ${a} C360 ${a - A * (.8 + .25 * s)} 540 ${a + A * (.8 + .25 * s)} 760 ${a} C980 ${a - A * (.8 + .2 * c)} 1160 ${a + .6 * A * (1 + .25 * c)} 1440 ${a - 20}`);
  });
}

// 스크롤 연동: 히어로 흐려짐, 답변 화면 기울기 펴짐, 떠 있는 카드 시차, 소개서 버튼
const body = $('.hero-body'), floats = $('.floats'), wide = matchMedia('(min-width:768px)');
function frame(t) {
  const y = scrollY, vh = innerHeight;
  if (wide.matches) { body.style.opacity = Math.max(0, 1 - y / 420); body.style.filter = y > 1 ? `blur(${Math.min(8, y / 60)}px)` : ''; }
  else body.style.opacity = body.style.filter = '';
  const r = sc.getBoundingClientRect(), p = Math.min(1, Math.max(0, (vh - r.top) / (vh - 87))), e = 1 - (1 - p) ** 3;
  app.style.transform = `translateY(${(1 - e) * 90}px) rotateX(${(1 - e) * 22}deg) scale(${.92 + .08 * e})`; app.style.opacity = .25 + .75 * e;
  cards.forEach(c => c.style.transform = `translateY(${-(r.top - vh * .3) * c.dataset.sp}px)`);
  if (p >= .98 && !played) { played = true; playApp(); } else if (p <= 0 && played) { played = false; resetApp(); }
  if (r.top < vh && r.bottom > 0) wave(t);
  floats.classList.toggle('on', y > 700);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// 탭 자동 순환 (기능 6s, 진행 막대 / 직무 5s). 직접 누르면 멈춤
function cycle(host, btns, ms, bar) {
  let i = 0, timer, stop = false;
  const mark = () => { $$('.prog', host).forEach(p => p.remove()); if (bar && !stop) btns[i].insertAdjacentHTML('beforeend', `<i class="prog" style="--ms:${ms}ms"></i>`); };
  const next = () => { timer = setTimeout(() => { i = (i + 1) % btns.length; btns[i].click(); mark(); next(); }, ms); };
  host.addEventListener('click', e => { if (e.isTrusted) { stop = true; clearTimeout(timer); mark(); } }, true);
  seen(host, () => { mark(); next(); });
}
cycle($('.ftabs'), $$('.ftabs button'), 6000, true);
cycle($('#jobs'), $$('#jobs [data-job]'), 5000);

// 보안: 데이터 흐름 혜성, 화살표 차례로 깜빡임, 카드 빛이 마우스를 따라옴
$('.fsteps')?.insertAdjacentHTML('afterbegin', '<i class="comet"></i>');
$$('.farr').forEach((a, i) => a.style.animationDelay = (.5 + i * .85) + 's');
$$('.scard').forEach(g => g.addEventListener('mousemove', e => { const r = g.getBoundingClientRect(); g.style.setProperty('--x', e.clientX - r.left + 'px'); g.style.setProperty('--y', e.clientY - r.top + 'px'); }));

// 요금제 링: 물결이 퍼지고 점이 돎
$('.price-sec .deco')?.insertAdjacentHTML('beforeend', '<i class="ripple"></i><i class="orbit"><i></i></i>');
})();
