// 업데이트 소식: 대상 필터, 버전 목록
const filt=document.querySelector('.ufilter');
if(filt)filt.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  filt.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
  const f=b.dataset.f;
  document.querySelectorAll('.ver').forEach(v=>{
    v.querySelectorAll('.ulist li').forEach(li=>li.hidden=f==='admin'?!li.hasAttribute('data-admin'):f==='user'&&li.hasAttribute('data-admin'));
    v.querySelectorAll('.hl').forEach(h=>h.hidden=f==='admin');
    const rows=v.querySelectorAll('.ulist li:not([hidden])').length;
    v.querySelector('.ver-b>h4').hidden=v.querySelector('.ulist').hidden=!rows;
    v.classList.toggle('empty',!rows&&!v.querySelector('.hl:not([hidden])'));
  });
};
document.querySelectorAll('.vnav a').forEach(a=>a.addEventListener('click',()=>document.querySelectorAll('.vnav a').forEach(x=>x.classList.toggle('on',x===a))));

// 도입 문의: 상담/견적 전환, 보낸 뒤 화면 (서버 전송 없음)
const form=document.getElementById('ctForm');
if(form){
  const STEPS={
    consult:['문의 뒤 진행 순서',[['담당자 연락','남겨 주신 회사 이메일이나 연락처로 담당자가 연락합니다.'],['요구사항 확인과 데모','쓰려는 업무와 연결할 DB를 듣고 실제 화면으로 시연합니다.'],['견적과 도입 방식 안내','인원과 도입 방식에 맞춰 견적과 일정을 정리해 드립니다.']]],
    quote:['견적 진행 순서',[['요청 내용 확인','담당자가 인원과 도입 방식을 확인하고 연락합니다.'],['구성 협의','구축형이면 서버, GPU, 네트워크 조건을 함께 맞춥니다.'],['견적서 발송','회사 이메일로 견적서와 도입 일정을 보내 드립니다.']]]
  };
  const setType=t=>{
    form.className='ct-form '+t;
    form.querySelectorAll('[data-for]').forEach(el=>el.querySelectorAll('input,select,textarea').forEach(i=>i.disabled=!el.dataset.for.includes(t)));
    document.getElementById('ctSubmit').textContent=t==='quote'?'견적 요청하기':'문의 보내기';
    document.getElementById('stepTitle').textContent=STEPS[t][0];
    document.getElementById('steps').innerHTML=STEPS[t][1].map((s,i)=>`<li><em>0${i+1}</em><div><b>${s[0]}</b><p>${s[1]}</p></div></li>`).join('');
  };
  form.addEventListener('change',e=>{if(e.target.name==='type')setType(e.target.value)});
  if(new URLSearchParams(location.search).get('type')==='quote')form.querySelector('[value=quote]').checked=true;
  setType(form.type.value);
  form.onsubmit=e=>{
    e.preventDefault();
    const d=new FormData(form),q=d.get('type')==='quote',esc=s=>String(s).replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
    const rows=[['문의 유형',q?'견적':'도입 상담'],['회사명',d.get('company')],['도입 방식',d.get(q?'qmode':'mode')],
      q?['사용자 수',d.get('users')+'명']:['연결하려는 DB',d.getAll('db').join(', ')||'선택 안 함']];
    document.getElementById('ctSum').innerHTML=rows.map(r=>`<div><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('');
    form.hidden=true;document.getElementById('ctDone').hidden=false;
    scrollTo({top:0,behavior:'smooth'});
  };
}
