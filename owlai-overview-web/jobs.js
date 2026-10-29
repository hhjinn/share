// 6 직무별 활용: 직무 5개 x 질문 3개 (Figma 2347:2, 2434:*, 2347:114~483)
// 표 셀 앞의 !r 은 빨간 강조, !b 는 파란 강조
const CODE = ['code', '실행한 SQL'];
const DOWN = ['down', '표 다운로드'];
const JOBS = [
  {
    name: '영업관리', title: '지역과 지점별 실적을<br>바로 비교합니다', desc: '매출 DB와 목표 파일을 함께 보고 실적이 낮은 지점을 찾습니다.',
    data: [['db', '영업 DB (Tibero)'], ['file', '지점별 목표.xlsx']],
    qs: [
      { q: '지난 분기 지역별 매출을 비교해줘',
        a: '3분기 매출은 <b>수도권이 42.3억 원</b>으로 가장 높습니다. 강원권은 14.0억 원으로 수도권의 <b>3분의 1 수준</b>입니다.',
        vis: { type: 'bars', title: '지역별 매출, 2026년 3분기 (억 원)', rows: [['수도권', 42.3, 380], ['영남권', 31.8, 286], ['충청권', 22.5, 202], ['호남권', 18.2, 163], ['강원권', 14.0, 126]] },
        chips: [CODE, ['table', 'sales_summary'], DOWN], fu: ['목표 대비 실적도 보여줘', '지점별로 나눠줘'] },
      { q: '목표 대비 실적이 낮은 지점을 찾아줘',
        a: '목표의 85%에 못 미친 지점은 4곳입니다.<br>춘천 지점이 64%로 가장 낮고, 원주 지점이 72%로 뒤를 잇습니다.',
        vis: { type: 'table', title: '목표 대비 실적, 2026년 3분기 (억 원)', cols: '220L,100R,100R,110R', rows: [['지점', '목표', '실적', '달성률'], ['춘천 지점', '3.50', '2.24', '!r64%'], ['원주 지점', '3.00', '2.16', '!r72%'], ['광주 서구 지점', '4.20', '3.28', '!r78%'], ['청주 지점', '3.80', '3.19', '!r84%']] },
        chips: [CODE, ['table', '지점별 목표.xlsx'], DOWN], fu: ['부진 원인을 품목별로 보여줘', '지난 분기와 비교해줘'] },
      { q: '주간 수주 현황을 플레이북으로 만들어줘',
        a: '주간 수주 현황 플레이북 초안을 만들었습니다.<br>매주 월요일 오전 8시에 지난주 수주를 조회해 엑셀 파일로 정리합니다.',
        vis: { type: 'table', title: '플레이북 초안: 주간 수주 현황', cols: '60L,150L,150L,170L', rows: [['순서', '단계', '대상', '결과'], ['1', 'DB 조회', '영업 DB', '지난주 수주 건'], ['2', 'AI 질의', '조회 결과', '전주 대비 요약'], ['3', '엑셀 만들기', '요약과 표', '주간수주.xlsx'], ['4', '예약 실행', '매주 월요일', '오전 8시 자동 실행']] },
        chips: [CODE, ['table', 'sales_orders'], ['', '플레이북 열기']], fu: ['금요일 오후로 바꿔줘', '지점별 합계도 넣어줘'] },
    ],
  },
  {
    name: '재무', title: '월 마감 숫자를<br>질문으로 확인합니다', desc: '회계 DB의 계정별 금액을 전월, 예산과 비교합니다.',
    data: [['db', '회계 DB (Oracle)'], ['file', '2026 예산.xlsx']],
    qs: [
      { q: '이번 달 판관비를 전월과 비교해줘',
        a: '10월 판관비는 <b>18.6억 원</b>으로 9월보다 <b>6.2% 늘었습니다</b>. 늘어난 금액의 절반 이상이 광고선전비입니다.',
        vis: { type: 'table', title: '계정별 판관비 (억 원)', cols: '200L,110R,110R,110R', rows: [['항목', '9월', '10월', '증감'], ['인건비', '9.80', '9.85', '+0.5%'], ['광고선전비', '2.10', '2.70', '!b+28.6%'], ['지급수수료', '1.95', '2.05', '+5.1%'], ['임차료', '1.60', '1.60', '0.0%'], ['기타', '2.06', '2.40', '+16.5%']] },
        chips: [CODE, ['table', 'gl_expense'], DOWN], fu: ['광고선전비를 캠페인별로 나눠줘', '예산 대비로도 보여줘'] },
      { q: '예산을 넘은 비용 항목을 알려줘',
        a: '10월 누적으로 예산을 넘은 항목은 4개입니다.<br>광고선전비가 예산보다 1.2억 원 많아 초과 금액이 가장 큽니다.',
        vis: { type: 'table', title: '예산 초과 항목, 10월 누적 (억 원)', cols: '220L,100R,100R,110R', rows: [['항목', '예산', '실적', '초과'], ['광고선전비', '18.00', '19.20', '!r+1.20'], ['지급수수료', '17.50', '18.10', '!r+0.60'], ['여비교통비', '2.40', '2.70', '!r+0.30'], ['소모품비', '1.10', '1.20', '!r+0.10']] },
        chips: [CODE, ['table', '2026 예산.xlsx'], DOWN], fu: ['광고선전비를 캠페인별로 나눠줘', '연말 예상치도 보여줘'] },
      { q: '거래처별 미수금을 기간별로 나눠줘',
        a: '미수금은 모두 8.37억 원입니다.<br>90일 넘은 미수금은 미래물산이 0.72억 원으로 가장 많습니다.',
        vis: { type: 'table', title: '거래처별 미수금 (억 원)', cols: '200L,110R,110R,110R', rows: [['거래처', '30일 이내', '31~90일', '90일 초과'], ['한빛유통', '2.10', '0.85', '!r0.40'], ['대성전자', '1.60', '0.30', '0.00'], ['미래물산', '0.90', '0.55', '!r0.72'], ['서진상사', '0.75', '0.20', '0.00']] },
        chips: [CODE, ['table', 'ar_aging'], DOWN], fu: ['90일 넘은 건의 전표를 보여줘', '지난달과 비교해줘'] },
    ],
  },
  {
    name: '경영기획', title: '흩어진 경영 지표를<br>한 번에 모읍니다', desc: '사업부별 DB와 사업계획서를 함께 읽고 지표를 정리합니다.',
    data: [['db', '경영정보 DB (PostgreSQL)'], ['file', '사업계획서.pdf']],
    qs: [
      { q: '사업부별 영업이익률 추이를 보여줘',
        a: '최근 5개 분기 동안 A 사업부는 <b>12%대를 유지</b>했습니다. C 사업부는 3분기에 8.4%로 한 분기 만에 <b>1.5%p 올랐습니다</b>.',
        vis: { type: 'line', title: '사업부별 영업이익률 (%)' },
        chips: [CODE, ['table', 'kpi_quarterly'], DOWN], fu: ['C 사업부 이익률이 오른 이유는?', 'KPI 달성률도 정리해줘'] },
      { q: '올해 KPI 달성률을 사업부별로 정리해줘',
        a: '3분기 누적으로 B 사업부의 영업이익 달성률이 79%로 가장 낮습니다.<br>C 사업부는 매출과 영업이익 모두 목표를 넘었습니다.',
        vis: { type: 'table', title: '사업부별 KPI 달성률, 3분기 누적 (%)', cols: '220L,100R,100R,110R', rows: [['사업부', '매출', '영업이익', '신규 고객'], ['A 사업부', '98', '104', '91'], ['B 사업부', '87', '79', '95'], ['C 사업부', '102', '110', '88'], ['전사', '95', '96', '91']] },
        chips: [CODE, ['table', '사업계획서.pdf'], DOWN], fu: ['B 사업부 이익이 낮은 이유는?', '월간 경영 보고에 넣어줘'] },
      { q: '월간 경영 보고 초안을 만들어줘',
        a: '10월 경영 보고 초안을 Word 파일로 만들었습니다.<br>4개 장으로 나눴고, 숫자마다 근거 자료를 달았습니다.',
        vis: { type: 'table', title: '10월 경영 보고 초안.docx 목차', cols: '60L,140L,200L,130L', rows: [['순서', '장', '내용', '근거'], ['1', '요약', '매출과 이익 핵심 수치', '경영정보 DB'], ['2', '사업부별 실적', '이익률 추이, KPI 달성률', '경영정보 DB'], ['3', '이슈와 대응', 'C 사업부 이익률 상승', '사업계획서.pdf'], ['4', '다음 달 계획', '계획 대비 남은 과제', '사업계획서.pdf']] },
        chips: [CODE, ['table', '사업계획서.pdf'], ['down', '파일 내려받기']], fu: ['회사 양식으로 다시 만들어줘', '파워포인트로도 만들어줘'] },
    ],
  },
  {
    name: '운영', title: '재고와 반품을<br>매일 같은 기준으로 봅니다', desc: '물류 DB의 재고와 반품 기록을 상품별로 묶어 봅니다.',
    data: [['db', '물류 DB (MySQL)'], ['file', '반품 사유 코드.csv']],
    qs: [
      { q: '안전 재고보다 적은 상품을 찾아줘',
        a: '안전 재고보다 적은 상품은 <b>4개</b>입니다. 그중 <b>무선 키보드 K2</b>는 안전 재고의 5분의 1만 남았습니다.',
        vis: { type: 'table', title: '안전 재고 미달 상품', cols: '220L,100R,100R,110R', rows: [['상품', '현재 재고', '안전 재고', '부족'], ['무선 키보드 K2', '38', '200', '!r-162'], ['USB-C 허브 6포트', '85', '150', '!r-65'], ['노트북 거치대 S', '112', '160', '!r-48'], ['27형 모니터 암', '41', '60', '!r-19']] },
        chips: [CODE, ['table', 'inventory_stock'], DOWN], fu: ['발주가 필요한 수량을 계산해줘', '반품 사유도 같이 보여줘'] },
      { q: '이번 달 반품 사유를 상품별로 나눠줘',
        a: '10월 반품은 93건입니다.<br>무선 키보드 K2는 불량이 24건으로 가장 많고, 모니터 암은 배송 파손이 11건입니다.',
        vis: { type: 'table', title: '상품별 반품 사유, 10월 (건)', cols: '220L,100R,100R,110R', rows: [['상품', '불량', '단순 변심', '배송 파손'], ['무선 키보드 K2', '24', '9', '3'], ['USB-C 허브 6포트', '17', '6', '1'], ['27형 모니터 암', '5', '4', '11'], ['노트북 거치대 S', '3', '8', '2']] },
        chips: [CODE, ['table', '반품 사유 코드.csv'], DOWN], fu: ['K2 불량 내용을 날짜별로 보여줘', '지난달과 비교해줘'] },
      { q: '매일 아침 재고 현황을 플레이북으로 받아줘',
        a: '재고 현황 플레이북 초안을 만들었습니다.<br>매일 오전 7시에 안전 재고보다 적은 상품을 정리해 엑셀 파일로 남깁니다.',
        vis: { type: 'table', title: '플레이북 초안: 매일 아침 재고 현황', cols: '60L,150L,150L,170L', rows: [['순서', '단계', '대상', '결과'], ['1', 'DB 조회', '물류 DB', '상품별 현재 재고'], ['2', 'AI 질의', '조회 결과', '안전 재고 미달 정리'], ['3', '엑셀 만들기', '정리한 표', '재고현황.xlsx'], ['4', '예약 실행', '매일', '오전 7시 자동 실행']] },
        chips: [CODE, ['table', 'inventory_stock'], ['', '플레이북 열기']], fu: ['주말은 빼줘', '부족 수량 열도 넣어줘'] },
    ],
  },
  {
    name: 'IT, DBA', title: '느린 쿼리의 원인을<br>실행 계획으로 찾습니다', desc: '실행 계획과 테이블 통계를 읽고 원인과 고칠 곳을 설명합니다.',
    data: [['db', '운영 DB (OpenSQL)'], ['file', 'DB 운영 지침.hwp']],
    qs: [
      { q: '이 쿼리가 느린 이유를 실행 계획으로 설명해줘',
        a: 'orders 테이블을 <b>전체 스캔</b>하고 있습니다. order_date에 함수를 씌운 조건 때문에 <b>인덱스를 쓰지 못합니다</b>.',
        vis: { type: 'plan', title: '실행 계획 (EXPLAIN)' },
        chips: [['code', '실행 계획 조회'], ['table', 'orders'], DOWN], fu: ['바꾼 쿼리의 실행 계획도 보여줘', '인덱스 목록도 보여줘'] },
      { q: '행 수가 가장 많이 늘어난 테이블을 보여줘',
        a: '지난 한 달 동안 order_items가 570만 행 늘어 가장 많이 늘었습니다.<br>access_log도 470만 행 늘었습니다.',
        vis: { type: 'table', title: '테이블별 행 수 (만 행)', cols: '220L,100R,100R,110R', rows: [['테이블', '9월', '10월', '증가'], ['order_items', '4,820', '5,390', '+570'], ['access_log', '3,150', '3,620', '+470'], ['orders', '1,180', '1,248', '+68'], ['payments', '1,020', '1,081', '+61']] },
        chips: [CODE, ['table', '테이블 통계'], DOWN], fu: ['용량 기준으로도 보여줘', '월별 증가 추이를 보여줘'] },
      { q: '역할별로 쓸 수 있는 DB를 정리해줘',
        a: '역할은 4개입니다.<br>report_ro는 두 DB를 읽기만 할 수 있고, 쓰기 권한은 app_rw와 batch_etl에만 있습니다.',
        vis: { type: 'table', title: '역할별 DB 권한', cols: '150L,240L,140L', rows: [['역할', '접속 가능 DB', '권한'], ['app_rw', 'orders_db', '읽기, 쓰기'], ['report_ro', 'orders_db, sales_db', '읽기'], ['batch_etl', 'staging_db', '읽기, 쓰기'], ['dba_admin', '전체', '전체']] },
        chips: [CODE, ['table', 'pg_roles'], DOWN], fu: ['권한이 넓은 역할을 찾아줘', '최근 바뀐 권한도 보여줘'] },
    ],
  },
];

const ic = (n, w = 14) => n ? `<img src="img/j-${n}.svg" width="${w}" height="${w}" alt="">` : '';

function visual(v) {
  let body = '';
  if (v.type === 'bars') {
    body = `<div class="jbars">${v.rows.map(([k, n, w], i) => `<div><span>${k}</span><i class="${i ? '' : 'top'}" style="--w:${w / 380}"></i><b class="${i ? '' : 'top'}">${n.toFixed(1)}</b></div>`).join('')}</div>`;
  } else if (v.type === 'table') {
    const cols = v.cols.split(',');
    const tpl = cols.map(c => `minmax(0,${parseInt(c)}fr)`).join(' ');
    body = `<div class="jtable" style="grid-template-columns:${tpl}">${v.rows.map((r, ri) => r.map((c, ci) => {
      const cls = [ri ? (ci ? '' : 'k') : 'h', cols[ci].endsWith('R') ? 'r' : '', c.startsWith('!r') ? 'red' : c.startsWith('!b') ? 'blue' : '', ri === v.rows.length - 1 ? 'nb' : ''].join(' ');
      return `<span class="${cls}">${c.replace(/^!\w/, '')}</span>`;
    }).join('')).join('')}</div>`;
  } else if (v.type === 'line') {
    body = `<div class="jline"><img src="img/j-line.svg" alt=""><div class="xs"><span>25.3Q</span><span>25.4Q</span><span>26.1Q</span><span>26.2Q</span><span>26.3Q</span></div><div class="lg"><span>${ic('dot-a', 8)}A 사업부</span><span>${ic('dot-b', 8)}B 사업부</span><span>${ic('dot-c', 8)}C 사업부</span></div></div>`;
  } else if (v.type === 'plan') {
    body = `<div class="jplan"><pre><span>SELECT STATEMENT</span><span>  HASH GROUP BY</span><span class="hot">    TABLE ACCESS FULL  ORDERS   (12,480,000 rows)</span><span class="flt">      filter: TO_CHAR(ORDER_DATE, 'YYYYMM') = '202609'</span></pre><p>${ic('spark')}<span>조건을 ORDER_DATE &gt;= DATE '2026-09-01' AND ORDER_DATE &lt; DATE '2026-10-01'로 바꾸면 IX_ORDERS_DATE 인덱스를 씁니다.</span></p></div>`;
  }
  return `<div class="jvis"><p class="vt">${v.title}</p>${body}</div>`;
}

function answer(q) {
  return `<div class="jq"><span>${q.q}</span></div>
    <div class="jans"><img src="img/favicon.svg" width="28" height="28" alt="OwlAI">
      <div><p class="jat">${q.a}</p>${visual(q.vis)}
        <div class="jchips">${q.chips.map(([i, t]) => `<span>${ic(i)}${t}</span>`).join('')}</div></div></div>
    <div class="jfu"><b>이어서 물어보기</b>${q.fu.map(t => `<span>${t}</span>`).join('')}</div>`;
}

const jobsEl = document.getElementById('jobs');
jobsEl.innerHTML = `<div class="jtabs">${JOBS.map((j, i) => `<button class="${i ? '' : 'on'}" data-job="${i}">${j.name}</button>`).join('')}</div><div class="jpanel"></div>`;
const panel = jobsEl.querySelector('.jpanel');

function showJob(ji, qi = 0) {
  const j = JOBS[ji];
  jobsEl.querySelectorAll('[data-job]').forEach(b => b.classList.toggle('on', b.dataset.job == ji));
  panel.innerHTML = `<div class="jleft">
      <p class="jname">${j.name}</p><h3>${j.title}</h3><p class="jdesc">${j.desc}</p>
      <p class="jcap">자주 하는 질문</p>
      <div class="jqs">${j.qs.map((q, i) => `<button class="${i === qi ? 'on' : ''}" data-q="${i}"><span>“${q.q}”</span>${ic(i === qi ? 'arrow-on' : 'arrow', 16)}</button>`).join('')}</div>
      <p class="jcap">연결한 데이터</p>
      <div class="jdata">${j.data.map(([i, t]) => `<span>${ic(i)}${t}</span>`).join('')}</div>
      <a href="#" class="jstart">이 질문으로 시작하기 →</a>
    </div>
    <div class="jcard">${answer(j.qs[qi])}</div>`;
  panel.querySelectorAll('[data-q]').forEach(b => b.onclick = () => showJob(ji, +b.dataset.q));
}
jobsEl.querySelectorAll('[data-job]').forEach(b => b.onclick = () => showJob(+b.dataset.job));
showJob(0);
