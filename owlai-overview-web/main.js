// 히어로 점 (Figma 2334:50~142, x,y,불투명도)
const DOTS='120,330,26 120,386,14 120,400,27 120,442,28 134,344,18 134,358,16 134,372,24 134,414,36 148,330,17 148,358,29 148,400,23 148,428,20 162,330,21 162,372,18 162,386,24 162,414,22 162,428,28 176,344,14 176,386,28 176,400,20 176,428,23 176,442,23 190,372,15 190,400,33 190,414,35 190,428,31 190,442,26 204,400,30 204,428,12 1180,300,23 1180,328,23 1180,342,27 1180,356,15 1180,370,34 1194,300,29 1194,314,34 1194,342,16 1194,398,33 1194,412,16 1208,300,13 1208,328,14 1208,384,15 1222,300,14 1222,342,22 1222,370,23 1222,384,20 1222,398,30 1222,412,19 1236,328,14 1236,398,23 1250,300,35 1250,314,23 1250,342,29 1250,356,35 1250,370,23 1250,384,34 1250,412,30 1264,300,35 1264,314,37 1264,328,33 1264,370,26 1264,384,22 1264,398,32 1264,412,23 250,700,30 250,742,37 264,700,16 264,714,16 264,742,20 278,714,25 292,714,18 292,728,20 292,742,27 306,714,16 1060,690,26 1060,732,18 1074,704,20 1088,690,23 1088,704,35 1116,690,33 1116,718,19 560,144,24 574,130,34 574,144,22 574,158,32 602,144,27 602,158,19 834,140,27 834,154,30 848,140,15 848,154,36 848,168,20 862,154,26';
const heroDots=document.getElementById('heroDots');if(heroDots)heroDots.innerHTML=DOTS.split(' ').map(d=>{const[x,y,a]=d.split(',');return`<i style="left:${x}px;top:${y}px;opacity:${a/100}"></i>`}).join('');

// 답변 화면 뒤 물결선 16개 (top 260부터 5px 간격)
const waves=document.getElementById('waves');if(waves)waves.innerHTML=[...Array(16)].map((_,i)=>`<img src="img/wave${i}.svg" style="top:${260+i*5}px" alt="">`).join('');

// 핵심 기능 첫 탭 앱 화면은 답변 화면 시안을 그대로 복제
document.getElementById('featApp')?.append(document.querySelector('.showcase .app').cloneNode(true));

// 고정 폭 시안 영역을 화면 폭에 맞춰 축소 (.fit-m 은 모바일에서만)
const mobile=matchMedia('(max-width:767px)');
function fit(){document.querySelectorAll('.fit').forEach(f=>{const c=f.firstElementChild;c.style.zoom='';if(f.classList.contains('fit-m')&&!mobile.matches)return;if(!f.offsetParent)return;c.style.zoom=1;const w=c.offsetWidth;c.style.zoom=Math.min(1,f.clientWidth/w)})}
addEventListener('resize',fit);fit();

// 탭 (data-tab 번호로 같은 섹션의 패널 전환)
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{const sec=b.closest('section');sec.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));sec.querySelectorAll('.fpanel,.jpanel,.upanel').forEach((p,i)=>p.classList.toggle('on',i==b.dataset.tab));fit()}));

// 스크롤하면 GNB 배경
const gnb=document.querySelector('.gnb');
const toTop=document.querySelector('.f-top');
addEventListener('scroll',()=>{gnb.classList.toggle('scrolled',scrollY>10);toTop.classList.toggle('show',scrollY>600)},{passive:true});
toTop.onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})};

// 리소스 메뉴, 모바일 메뉴
const sub=document.querySelector('.has-sub');
sub.querySelector('.sub-btn').onclick=e=>{e.stopPropagation();sub.classList.toggle('open')};
document.addEventListener('click',()=>sub.classList.remove('open'));
document.querySelector('.gnb-burger').onclick=()=>gnb.classList.toggle('menu-open');
document.querySelectorAll('.gnb-menu>a').forEach(a=>a.addEventListener('click',()=>gnb.classList.remove('menu-open')));

// FAQ 는 한 번에 하나만 펼침
document.querySelectorAll('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.faq-list details').forEach(o=>o!==d&&(o.open=false))}));

// 소개서 받기 창 (data-brochure 버튼, 메일 발송은 화면만)
const bro=document.createElement('dialog');
bro.className='bro-dlg';
const isEn=document.documentElement.lang==='en',t=(ko,en)=>isEn?en:ko;
const opts=(ph,a)=>`<option value="" disabled selected hidden>${ph}</option>`+a.map(o=>`<option>${o}</option>`).join('');
bro.innerHTML=`<form class="bro-form">
  <button type="button" class="bro-x" data-close aria-label="${t('닫기','Close')}">✕</button>
  <h2>${t('소개서 받기','Get brochure')}</h2><p class="bro-sub">${t('입력하신 이메일로 OwlAI 소개서(PDF)를 보내 드립니다.','We will send the OwlAI brochure (PDF) to your email.')}</p>
  <div class="bro-hd"><b>${t('신청인 정보','Your information')}</b><span>${t('필수 정보','Required')}</span></div>
  <div class="bro-rows">
    <label>${t('성명','Name')}</label><div><input name="name" placeholder="${t('성명을 입력해 주세요.','Enter your name.')}"></div>
    <label>${t('회사명','Company')}</label><div><input name="company" placeholder="${t('회사명을 입력해 주세요.','Enter your company name.')}"></div>
    <label class="req">${t('이메일','Email')}</label><div><input name="email" type="email" required placeholder="${t('회사 이메일을 입력해 주세요.','Enter your work email.')}"></div>
    <label>${t('휴대폰번호','Mobile')}</label><div class="bro-tel"><select name="t1">${['010','011','016','017','018','019'].map(o=>`<option>${o}</option>`).join('')}</select><i>-</i><input name="t2" inputmode="numeric" maxlength="4" aria-label="${t('가운데 번호','Middle digits')}"><i>-</i><input name="t3" inputmode="numeric" maxlength="4" aria-label="${t('끝 번호','Last digits')}"></div>
    <label>${t('부서명','Department')}</label><div><input name="dept" placeholder="${t('부서명을 입력해 주세요.','Enter your department.')}"></div>
    <label>${t('직무','Role')}</label><div><select name="job">${isEn?opts('Select a role',['Planning','Sales ops','Finance','Operations','IT, DBA','Other']):opts('직무를 선택하세요',['경영기획','영업관리','재무','운영','IT, DBA','기타'])}</select></div>
    <label>${t('직책','Title')}</label><div><select name="rank">${isEn?opts('Select a title',['Staff','Manager','Senior manager','Director','Executive','Other']):opts('직책을 선택하세요',['사원','대리','과장','차장','부장','임원','기타'])}</select></div>
  </div>
  <div class="bro-agree">
    <label class="all"><input type="checkbox" data-all>${t('전체 동의하기','Agree to all')}</label>
    <label><input type="checkbox" required>${t('[필수] 개인정보 수집 및 이용에 동의합니다.','[Required] I agree to the collection and use of personal information.')}</label>
    <label><input type="checkbox">${t('[선택] 마케팅 정보 수집 및 이용에 동의합니다.','[Optional] I agree to the collection and use of marketing information.')}</label>
  </div>
  <div class="bro-btns"><button type="button" class="bro-cancel" data-close>${t('취소','Cancel')}</button><button class="bro-send">${t('메일 발송','Send')}</button></div>
</form>
<div class="bro-done" hidden><i><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></i><h2>${t('소개서 발송 완료','Brochure sent')}</h2><p>${t('입력하신 이메일로 OwlAI 소개서(PDF)를 보냈습니다.','We sent the OwlAI brochure (PDF) to your email.')}</p><div><button type="button" class="bro-send" data-close>${t('확인','OK')}</button></div></div>`;
document.body.append(bro);
const broForm=bro.querySelector('.bro-form'),broDone=bro.querySelector('.bro-done'),boxes=[...broForm.querySelectorAll('.bro-agree input:not([data-all])')],all=broForm.querySelector('[data-all]');
all.onchange=()=>boxes.forEach(b=>b.checked=all.checked);
boxes.forEach(b=>b.onchange=()=>all.checked=boxes.every(x=>x.checked));
broForm.onsubmit=e=>{e.preventDefault();broForm.hidden=true;broDone.hidden=false;bro.classList.add('done')};
bro.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>bro.close());
bro.addEventListener('click',e=>{if(e.target===bro)bro.close()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-brochure]');if(!t)return;e.preventDefault();broForm.reset();broForm.hidden=false;broDone.hidden=true;bro.classList.remove('done');bro.showModal()});
