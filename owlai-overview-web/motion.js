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
  // 이미 그려진 요소는 숨긴 상태로 바로 바꾼 뒤 지연을 붙임 (안 그러면 사라지는 쪽에 지연이 걸려 처음부터 보임)
  el.style.transition = 'none'; el.classList.add('rv'); void el.offsetWidth; el.style.transition = '';
  el.style.transitionDelay = delay + 's'; el.style.setProperty('--ld', delay + 's');
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
$('.hero .deco').insertAdjacentHTML('beforeend', '<i class="shock"></i><i class="shock" style="animation-delay:.85s"></i>');
$$('[class*=deco] img[src*="ell"],[class*=deco] img[src*="blob"],[class*=deco] img[src*="glow"]').forEach((b, i) => b.classList.add(i % 2 ? 'drift2' : 'drift1'));
hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); hero.style.setProperty('--mx', e.clientX - r.left + 'px'); hero.style.setProperty('--my', e.clientY - r.top + 'px'); });

// 히어로 등장 순서 (0.85s 뒤 0.1s 간격): 배지 1, 헤드라인 단어 2~, 부제 8, 입력창 9, 받침 10, 양옆 칩 12, 13 (옆에서), 안내 14
const h1 = $('.hero h1'), hd = d => .85 + d * .1;
h1.innerHTML = h1.innerHTML.split(/(<br>|<em>.*?<\/em>|\s+)/).map(p => !p || /^\s+$/.test(p) || p === '<br>' ? p : `<span class="w">${p}</span>`).join('');
reveal($('.chip-dark'), hd(1)); $$('.w', h1).forEach((w, i) => reveal(w, hd(2 + i))); reveal($('.hero-sub'), hd(8));
reveal($('.prompt-box'), hd(9)); reveal($('.prompt-back'), hd(10)); reveal($('.hero-note'), hd(14));
$$('.prompt .tag').forEach((t, i) => { t.style.setProperty('--from', i < 2 ? '-40px' : '40px'); reveal(t, hd(12 + i % 2)); });
document.documentElement.classList.add('mo-ready');

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
// 입력창 양옆 연결선: 2.3s 에 그려지고, 질문을 칠 때와 보낼 때 빛이 지나감 (Figma 좌표에서 입력창 층 140, 526 을 뺌)
const WIRES = ['M144 43H172V70.5H200', 'M183 186.5H191.5V150H200', 'M960 70.5H986V43H1012', 'M960 150H985V186.5H1010'];
prompt.insertAdjacentHTML('beforeend', `<svg class="wires" width="1160" height="250">${WIRES.map(d => `<path d="${d}"/>`).join('')}${[[200.5, 70.5], [200.5, 150.5], [960.5, 70.5], [960.5, 150.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5"/>`).join('')}</svg>` + WIRES.map(d => `<i class="pulse" style="offset-path:path('${d}')"></i>`).join(''));
setTimeout(() => $('.wires').classList.add('on'), 2300);
const pulses = $$('.prompt .pulse');
const fire = list => list.forEach((i, n) => { const p = pulses[i]; p.classList.remove('run'); void p.offsetWidth; p.style.animationDelay = n * .12 + 's'; p.classList.add('run'); });
let cid = 0, qi = 0; // 스크롤로 멈추면 cid 가 바뀌어 진행 중인 순환이 그만둠
const typeInto = async (el, s, ms, my) => { for (let i = 1; i <= s.length; i++) { if (my != null && my !== cid) return; el.textContent = s.slice(0, i); await wait(ms); } };
const lit = (i, ms = 900) => { tags[i]?.classList.add('lit'); setTimeout(() => tags[i]?.classList.remove('lit'), ms); };
function openAns(d) {
  $('.hans-t span').textContent = d.t; $('.hans-r b').textContent = d.r; $('.hans-s span').textContent = '';
  $('.hans-c').innerHTML = d.v.map((v, i) => `<div><i class="${i === d.hi ? 'hi' : ''}"></i><span>${d.l[i]}</span></div>`).join('');
  note.classList.add('hide'); hans.classList.add('open');
  setTimeout(() => { $$('.hans-c i').forEach((b, i) => setTimeout(() => b.style.height = d.v[i] + '%', i * 90)); lit(2, 1400); }, 350);
  setTimeout(() => { lit(3, 2200); typeInto($('.hans-s span'), d.sql, 22); }, 900);
}
setTimeout(() => aura.classList.add('on'), 2600);
const PH = isEn ? 'Ask OwlAI anything' : 'OwlAI에게 무엇이든 물어보세요';
const closeAns = () => { hans.classList.remove('open'); note.classList.remove('hide'); };
async function cycle(my) {
  while (my === cid) {
    const d = QA[qi++ % QA.length];
    typing.classList.remove('ph'); typing.textContent = ''; fire([0, 1]); lit(0); lit(1); aura.classList.add('typing');
    await typeInto(typing, d.q, 60, my); await wait(700); if (my !== cid) return;
    send.classList.remove('go'); void send.offsetWidth; send.classList.add('go'); fire([2, 3]);
    aura.classList.remove('typing'); aura.classList.add('sent'); setTimeout(() => aura.classList.remove('sent'), 1400);
    await wait(450); if (my !== cid) return; openAns(d); await wait(5150); if (my !== cid) return;
    closeAns(); typing.classList.add('ph'); typing.textContent = PH; await wait(1000);
  }
}
function lockHero() { cid++; closeAns(); aura.classList.remove('typing', 'sent'); typing.classList.remove('ph'); typing.textContent = QA[0].q; }
function unlockHero() { const my = ++cid; typing.classList.add('ph'); typing.textContent = PH; setTimeout(() => cycle(my), 800); }
setTimeout(() => cycle(cid), 3200);

// 섹션 등장 (부모 안 순서대로 0.09s 간격, 제목은 위에서 드러남)
const RV = ['.head>*', '.job-head>.lead', '.db-support', '.steps>*', '.flow', '.ftabs', '.fpanels', '.more-h', '.mcard', '#jobs', '.sec-head-r', '.flowbox', '.scard', '.cmp',
  '.price-l>*', '.price-btns', '.plan', '.more-sec .feat>.eyebrow', '.sec2 .sec>.eyebrow', '.faq-l>*', '.faq-list details', '.cta>h2', '.cta>p', '.cta-input', '.cta-link', '.foot-top', '.foot-info'];
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
let pid = 0, played = false, steps = [];
const show = (...els) => els.forEach(e => e?.classList.add('show'));
const run = st => { if (!st.done) { st.done = true; st.fn(); } };
// 고정 구간을 빨리 스크롤하면 그만큼 단계를 앞당김 (구간 80% 지점에서 전부 나옴)
const advance = q => { const t = q / .8 * 3050 * .65; steps.forEach(st => st.ms <= t && run(st)); };
function playApp() {
  const my = ++pid; steps = [];
  const at = (ms, fn) => { const st = { ms: ms * .65, fn, done: false }; steps.push(st); setTimeout(() => my === pid && run(st), st.ms); };
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
  pid++; steps = []; $$('.show', sc).forEach(e => e.classList.remove('show')); dbCard?.classList.remove('ping');
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

// S2-0 고정: 데스크톱에서 답변 화면을 화면 높이 무대로 붙잡고 1000px 동안 유지. 무대 안 내용은 GNB 아래 남은 높이의 가운데
const pin = document.createElement('div'); sc.before(pin); pin.append(sc);
const deco2 = $('.deco', sc), box = $('.prompt-box'), comp = $('.comp-box', app);
let STOP = 0, lay = '';
function layout(on, vh) {
  if (lay === on + ':' + vh) return; lay = on + ':' + vh;
  if (!on) { pin.style.height = ''; sc.removeAttribute('style'); deco2.style.top = ''; STOP = 0; return; }
  STOP = Math.round(64 + Math.max(16, (vh - 64 - 700) / 2));
  pin.style.height = vh + 1000 + 'px'; deco2.style.top = STOP + 'px';
  sc.style.cssText = `position:sticky;top:0;height:${vh}px;padding:${STOP}px 0 0;background:linear-gradient(#000f24 0,#000f24 ${STOP + 199}px,#f4f4f8 ${STOP + 199}px)`;
}

// H15 입력창 이동: 히어로 입력창이 스크롤에 따라 답변 화면 입력창 자리로 날아가며 크기와 색이 바뀜. 위로 가면 거꾸로
const L = (a, b, t) => a + (b - a) * t, sm = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
let fly = null, locked = false;
function morph(f, y, pinTop) {
  if (!fly) {
    fly = document.createElement('div'); fly.className = 'fly'; const c = box.cloneNode(true); c.className = 'prompt-box'; c.removeAttribute('style'); fly.append(c);
    const t = $('.typing', c); t.classList.remove('ph'); t.textContent = QA[0].q; document.body.append(fly);
  }
  const c = fly.firstChild, s = box.getBoundingClientRect(), d = comp.getBoundingClientRect(), r = sc.getBoundingClientRect();
  const e = f < .5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2, m = sm(.62, .92, f);
  const W = L(s.width, d.width, e), H = L(s.height, d.height, e), z = L(s.width / box.offsetWidth, d.width / comp.offsetWidth, e);
  fly.style.cssText = `left:${L(s.left, d.left, e)}px;top:${L(s.top + y, pinTop + d.top - r.top, e)}px;width:${W}px;height:${H}px;opacity:${f >= .98 ? 0 : 1}`;
  const C = (a, b) => a.map((v, i) => L(v, b[i], m).toFixed(3)).join(',');
  Object.assign(c.style, { zoom: z, width: W / z + 'px', height: H / z + 'px', padding: L(18, 0, m) + 'px', borderRadius: L(20, 12, e) + 'px',
    background: `rgba(${C([5, 31, 61, .92], [255, 255, 255, 1])})`, borderColor: `rgba(${C([255, 255, 255, .16], [218, 220, 224, .72])})`,
    boxShadow: `0 ${L(20, 6, m)}px ${L(70, 18, m)}px rgba(0,39,84,${L(.35, .1, m)})` });
  c.style.setProperty('--m', m);
  Object.assign($('.prompt-input', c).style, { height: L(104, H / z, m) + 'px', padding: `${L(18, 11, m)}px ${L(18, 12, m)}px`, fontSize: L(17, 11.56, m) + 'px',
    lineHeight: L(25.5, 18, m) + 'px', background: `rgba(255,255,255,${.04 * (1 - m)})`, color: `rgba(${C([255, 255, 255, .92], [32, 33, 36, 1])})` });
  Object.assign($('.prompt-input b', c).style, { opacity: 1 - m, marginLeft: L(0, -22, m) + 'px' });
  $('.caret', c).style.height = L(22, 14, m) + 'px';
  $('.prompt-bar', c).style.opacity = Math.max(0, 1 - f * 4);
}

// 스크롤 연동: 히어로 흐려짐, 입력창 이동, 답변 화면 기울기 펴짐과 재생, 떠 있는 카드 시차, 소개서 버튼
const body = $('.hero-body'), floats = $('.floats'), wide = matchMedia('(min-width:768px)');
function unfly() { if (!locked) return; locked = false; unlockHero(); box.style.visibility = ''; aura.classList.remove('off'); fly?.remove(); fly = null; }
function frame(t) {
  const y = scrollY, vh = innerHeight, W = wide.matches;
  layout(W, vh);
  if (W) { body.style.opacity = Math.max(0, 1 - y / 420); body.style.filter = y > 1 ? `blur(${Math.min(8, y / 60)}px)` : ''; }
  else body.style.opacity = body.style.filter = '';
  app.style.transform = 'none'; // 도착 자리는 펴진 상태로 잼
  const r = sc.getBoundingClientRect(), pinTop = pin.getBoundingClientRect().top + y;
  let f;
  if (W) {
    f = Math.min(1, Math.max(0, y / pinTop));
    if (f > .01) { if (!locked) { locked = true; lockHero(); box.style.visibility = 'hidden'; aura.classList.add('off'); } morph(f, y, pinTop); }
    else unfly();
  } else { f = Math.min(1, Math.max(0, (vh - r.top) / (vh - 87))); unfly(); }
  const p = W ? Math.min(1, Math.max(0, (vh - r.top - STOP) / (vh - STOP))) : f, e = 1 - (1 - p) ** 3;
  app.style.transform = `translateY(${(1 - e) * 90}px) rotateX(${(1 - e) * 22}deg) scale(${.92 + .08 * e})`; app.style.opacity = .25 + .75 * e;
  cards.forEach(c => c.style.transform = `translateY(${-(r.top - vh * .3) * c.dataset.sp}px)`);
  if (f >= .98 && !played) { played = true; playApp(); } else if (f <= (W ? .01 : 0) && played) { played = false; resetApp(); }
  if (played && W) advance((y - pinTop) / 1000);
  if (r.top < vh && r.bottom > 0) wave(t);
  floats.classList.toggle('on', y > 700);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// 탭 자동 순환 (기능 6s, 진행 막대 / 직무 5s). 직접 누르면 멈춤
function autoTabs(host, btns, ms, bar) {
  let i = 0, timer, stop = false;
  const mark = () => { $$('.prog', host).forEach(p => p.remove()); if (bar && !stop) btns[i].insertAdjacentHTML('beforeend', `<i class="prog" style="--ms:${ms}ms"></i>`); };
  const next = () => { timer = setTimeout(() => { i = (i + 1) % btns.length; btns[i].click(); mark(); next(); }, ms); };
  host.addEventListener('click', e => { if (e.isTrusted) { stop = true; clearTimeout(timer); mark(); } }, true);
  seen(host, () => { mark(); next(); });
}
autoTabs($('.ftabs'), $$('.ftabs button'), 6000, true);
autoTabs($('#jobs'), $$('#jobs [data-job]'), 5000);

// 보안: 데이터 흐름 혜성, 화살표 차례로 깜빡임, 카드 빛이 마우스를 따라옴
$('.fsteps')?.insertAdjacentHTML('afterbegin', '<i class="comet"></i>');
$$('.farr').forEach((a, i) => a.style.animationDelay = (.5 + i * .85) + 's');
$$('.scard').forEach(g => g.addEventListener('mousemove', e => { const r = g.getBoundingClientRect(); g.style.setProperty('--x', e.clientX - r.left + 'px'); g.style.setProperty('--y', e.clientY - r.top + 'px'); }));

// 요금제 링: 물결이 퍼지고 점이 돎
$('.price-sec .deco')?.insertAdjacentHTML('beforeend', '<i class="ripple"></i><i class="orbit"><i></i></i>');
})();
