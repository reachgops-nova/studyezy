/* ============================================================
   SmartIGCSE — player-app.js
   Renders ANY pack that passes engine/validate.mjs.
   Contains no content and no subject knowledge whatsoever.
   ============================================================ */
const PACK = JSON.parse(document.getElementById('pack').textContent);
const STORE_KEY = 'smartigcse:' + PACK.packId;

let STATE = { answers:{}, results:{}, hints:{}, i18n:{}, lang:'en' };
const hasStorage = typeof window!=='undefined' && window.storage && typeof window.storage.get==='function';

async function loadState(){
  if(!hasStorage) return;
  try{ const r=await window.storage.get(STORE_KEY);
       if(r&&r.value) STATE=Object.assign(STATE, JSON.parse(r.value)); }catch(e){}
}
let saveTimer=null;
function saveState(){
  if(!hasStorage) return;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{ try{ await window.storage.set(STORE_KEY, JSON.stringify(STATE)); }catch(e){} },400);
}
function toast(m){ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2400); }

const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nl2 = s => esc(s).replace(/\n/g,'<br>');

const ICON={
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7v6h6"/><path d="M3.5 13a9 9 0 1 0 2.1-5.6L3 10"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>'
};

/* ============================================================
   DECLARATIVE MEDIA — the pack supplies parameters, never markup
   ============================================================ */
const MEDIA_RENDERERS = {
  thermometer(m){
    const ticks=[]; for(let t=m.min;t<=m.max;t+=m.step) ticks.push(t);
    const span=m.max-m.min, fill=((m.reading-m.min)/span)*470;
    return `<svg viewBox="0 0 520 90" role="img" aria-label="Thermometer reading ${m.reading} degrees">
      <text x="250" y="16" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" fill="#4A5B70">Temperature °C</text>
      <circle cx="24" cy="46" r="13" fill="#C42F2F"/>
      <rect x="30" y="38" width="470" height="17" rx="8" fill="#fff" stroke="#7B8A9C" stroke-width="1.5"/>
      <rect x="30" y="41" width="${Math.max(0,fill)}" height="11" rx="5" fill="#C42F2F"/>
      ${ticks.map((t,i)=>{const x=40+i*(450/(ticks.length-1));
        return `<line x1="${x}" y1="30" x2="${x}" y2="38" stroke="#14243A" stroke-width="1.5"/>
        <text x="${x}" y="76" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="#14243A">${t}</text>`;}).join('')}
    </svg>`;
  },
  number_line(m){
    const ticks=[]; for(let t=m.min;t<=m.max;t+=m.step) ticks.push(t);
    const gap=520/(ticks.length-1);
    return `<svg viewBox="0 0 580 60" role="img" aria-label="Number line from ${m.min} to ${m.max}">
      <line x1="20" y1="26" x2="560" y2="26" stroke="#14243A" stroke-width="2"/>
      <path d="M20 26 l10 -5 v10 z M560 26 l-10 -5 v10 z" fill="#14243A"/>
      ${ticks.map((t,i)=>{const x=30+i*gap;
        return `<line x1="${x}" y1="18" x2="${x}" y2="34" stroke="#14243A" stroke-width="1.5"/>
        <text x="${x}" y="52" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" fill="#14243A">${t}</text>`;}).join('')}
    </svg>`;
  },
  spider(m){
    const pos=[[90,30],[330,30],[20,110],[400,110],[90,190],[330,190]];
    return `<svg viewBox="0 0 500 230" role="img" aria-label="${m.centre} in the centre with ${m.around.length} numbers around it">
      ${m.around.map((v,i)=>`<line x1="${pos[i][0]+50}" y1="${pos[i][1]+16}" x2="215" y2="115" stroke="#C7D8E6" stroke-width="2"/>`).join('')}
      <circle cx="215" cy="115" r="46" fill="#14243A"/>
      <text x="215" y="121" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="19" font-weight="600" fill="#fff">${m.centre}</text>
      ${m.around.map((v,i)=>`<rect x="${pos[i][0]}" y="${pos[i][1]}" width="100" height="32" rx="16" fill="#E7EFF9" stroke="#1D5FA8" stroke-width="1.5"/>
      <text x="${pos[i][0]+50}" y="${pos[i][1]+21}" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="15" fill="#164B85">${v}</text>`).join('')}
    </svg>`;
  },
  square_pattern(m){
    const s=15,gap=5; let out=`<svg viewBox="0 0 620 150" role="img" aria-label="Growing patterns made from squares">`;
    m.stages.forEach(([top,bottom],i)=>{
      const ox=20+i*200;
      out+=`<text x="${ox}" y="18" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="#14243A">Pattern ${i+1}</text>`;
      for(let c=0;c<top;c++) out+=`<rect x="${ox+c*(s+gap)}" y="40" width="${s}" height="${s}" fill="#14243A" rx="2"/>`;
      for(let c=0;c<bottom;c++) out+=`<rect x="${ox+10+c*(s+gap)}" y="${40+s+5}" width="${s}" height="${s}" fill="#14243A" rx="2"/>`;
    });
    return out+'</svg>';
  },
  matchstick(m){
    const yT=20,yB=66,roof=6; let out=`<svg viewBox="0 0 560 86" role="img" aria-label="Matchstick pattern in ${m.stages} stages">`;
    for(let stage=1;stage<=m.stages;stage++){
      const ox=15+(stage-1)*138, edges=new Map();
      const add=(x1,y1,x2,y2)=>{const k=[x1,y1,x2,y2].map(Math.round).join(','),r=[x2,y2,x1,y1].map(Math.round).join(',');
        if(!edges.has(k)&&!edges.has(r)) edges.set(k,[x1,y1,x2,y2]);};
      if(m.shape==='triangle'){ const w=13;
        for(let k=0;k<stage;k++){ const j=Math.floor(k/2);
          const B=i=>[ox+i*2*w,yB], T=i=>[ox+w+i*2*w,yT];
          if(k%2===0){const[bx,by]=B(j),[tx,ty]=T(j),[b2x,b2y]=B(j+1);
            add(bx,by,b2x,b2y); add(bx,by,tx,ty); add(tx,ty,b2x,b2y);}
          else {const[tx,ty]=T(j),[b2x,b2y]=B(j+1),[t2x,t2y]=T(j+1);
            add(tx,ty,b2x,b2y); add(b2x,b2y,t2x,t2y); add(tx,ty,t2x,t2y);} } }
      else if(m.shape==='square'){ const w=28;
        for(let k=0;k<stage;k++){const x=ox+k*w;
          add(x,yT,x+w,yT); add(x,yB,x+w,yB); add(x,yT,x,yB); add(x+w,yT,x+w,yB);} }
      else { const w=26;
        for(let k=0;k<stage;k++){const x=ox+k*w,yE=yT+roof+8,yA=yT-4;
          add(x,yB,x+w,yB); add(x,yE,x,yB); add(x+w,yE,x+w,yB); add(x,yE,x+w/2,yA); add(x+w/2,yA,x+w,yE);} }
      edges.forEach(([x1,y1,x2,y2])=>{ out+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#14243A" stroke-width="3" stroke-linecap="round"/>`; });
    }
    return out+'</svg>';
  },
  photo_crop(m){
    return `<p class="redrawn">Original figure could not be rebuilt automatically${m.note?': '+esc(m.note):''}. Sent for review.</p>`;
  }
};
function renderMedia(m){
  const r=MEDIA_RENDERERS[m.kind];
  if(!r) return `<p class="redrawn">Unsupported figure type "${esc(m.kind)}".</p>`;
  return `<div class="diagram">${r(m)}</div>${m.redrawn?'<p class="redrawn">Diagram redrawn for clarity.</p>':''}`;
}

/* ============================================================
   STATE HELPERS
   ============================================================ */
let view='contents';
const sheetById = id => PACK.sheets.find(s=>s.id===id);
const getAns=(q,k)=>{const a=STATE.answers[q.id]; return a?a[k]:undefined;};
function setAns(q,k,v){ (STATE.answers[q.id]=STATE.answers[q.id]||{})[k]=v; delete STATE.results[q.id]; saveState(); }
const isBlank=v=>v===undefined||v===null||(Array.isArray(v)?!v.length:String(v).trim()==='');
const allQuestions=()=>PACK.sheets.flatMap(s=>s.questions.map(q=>({s,q})));

/* ============================================================
   RENDER
   ============================================================ */
function buildTabs(){
  const items=[{id:'contents',label:'Contents',sub:PACK.sheets.length+' worksheets'}]
    .concat(PACK.sheets.map(s=>({id:s.id,label:'Worksheet '+s.no,sub:s.title})))
    .concat([{id:'report',label:'Progress',sub:'what to practise'}]);
  document.getElementById('tabs').innerHTML=items.map(it=>
    `<button class="tab" role="tab" data-view="${it.id}" aria-selected="${it.id===view}">
      ${esc(it.label)}<small>${esc(it.sub)}</small></button>`).join('');
}
function renderMain(){
  const m=document.getElementById('main');
  m.innerHTML = view==='contents'?renderContents() : view==='report'?renderReport() : renderSheet(sheetById(view));
  updateMeter();
}

function renderContents(){
  const stat=id=>{const s=sheetById(id); if(!s) return null;
    let c=0; s.questions.forEach(q=>{ if(STATE.results[q.id]==='correct') c++; });
    return c+' / '+s.questions.length+' correct';};
  return `<div class="sheet-head">
      <p class="eyebrow">${esc(PACK.curriculum.board)} · ${esc(PACK.curriculum.stage)}</p>
      <h2>${esc(PACK.source.book)}</h2>
      <p class="obj">${esc(PACK.curriculum.subject)} — ${esc(PACK.curriculum.strand||'')}. Converted from ${PACK.source.photoCount} photographed pages.</p>
      <div class="sheet-meta"><span>${esc(PACK.source.school||'')}</span><span>pack ${esc(PACK.packId)}</span><span>extraction confidence: ${esc(PACK.source.confidence||'unknown')}</span></div>
    </div>
    ${PACK.source.reviewNotes?`<div class="trick">${ICON.info}<div><h3>Note from conversion</h3><p>${esc(PACK.source.reviewNotes)}</p></div></div>`:''}
    <div class="tbl-scroll"><table class="idx">
      <thead><tr><th>WS</th><th>Topic</th><th>Objective</th><th>Page</th><th>Status</th></tr></thead>
      <tbody>${(PACK.contents||[]).map(c=>{const st=c.sheetId?stat(c.sheetId):null;
        return `<tr class="${st?'ready':''}"><td>${c.no}</td><td>${esc(c.topic)}</td><td>${esc(c.objective)}</td><td>${c.page}</td>
        <td class="status ${st?'on':'off'}">${st||'in the printed book'}</td></tr>`;}).join('')}</tbody>
    </table></div>`;
}

function renderSheet(sheet){
  let h=`<div class="sheet-head">
      <p class="eyebrow">Worksheet ${sheet.no}</p>
      <h2>${esc(sheet.title)}</h2>
      <p class="obj">${esc(sheet.objective)}</p>
      <div class="sheet-meta"><span>${esc(PACK.curriculum.strand||PACK.curriculum.subject)}</span><span>Book page ${esc(sheet.page)}</span><span>skill: ${esc(sheet.skill||'—')}</span></div>
    </div>`;
  if(sheet.reviewNote) h+=`<div class="trick">${ICON.info}<div><h3>About the diagrams</h3><p>${esc(sheet.reviewNote)}</p></div></div>`;
  if(sheet.strategy) h+=`<div class="trick">${ICON.bulb}<div><h3>${esc(sheet.strategy.title)}</h3><p>${esc(sheet.strategy.body)}</p></div></div>`;
  sheet.questions.forEach(q=>{h+=renderQuestion(sheet,q);});
  let c=0; sheet.questions.forEach(q=>{if(STATE.results[q.id]==='correct')c++;});
  h+=`<div class="sheet-foot">
      <div class="score">Worksheet ${sheet.no}: <strong>${c}</strong> of ${sheet.questions.length} questions correct</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" data-act="checkall">${ICON.check} Check whole worksheet</button>
        <button class="btn btn-ghost" data-act="clearall">${ICON.undo} Clear my answers</button>
      </div></div>`;
  return h;
}

function renderQuestion(sheet,q){
  const res=STATE.results[q.id], hint=STATE.hints[q.id];
  const tr=STATE.i18n[q.id+':'+STATE.lang];
  let h=`<section class="q ${res==='correct'?'is-right':res==='wrong'?'is-wrong':''}" data-qid="${q.id}" id="qq-${q.id}">
    <div class="q-head"><span class="q-no">${esc(q.label)}</span>
      <p class="q-prompt">${esc(q.prompt)}${q.sub?`<span class="sub">${esc(q.sub)}</span>`:''}</p>
      ${res?tick(res==='correct'):''}</div>`;
  if(q.needsHuman) h+=`<div class="panel hint"><h4>Needs a check</h4><p>${esc(q.reviewReason||'This question could not be read confidently from the photograph.')}</p></div>`;
  if(q.media) h+=renderMedia(q.media);
  if(q.layout==='grid') h+=renderGrid(q);
  else if(q.layout==='table') h+=renderTable(q);
  else h+=`<div class="fields ${q.layout==='row'?'row':''}">${q.fields.map(f=>renderField(q,f)).join('')}</div>`;

  h+=`<div class="q-actions">
      <button class="btn btn-primary" data-act="check">${ICON.check} Check answer</button>
      <button class="btn btn-hint" data-act="hint">${ICON.bulb} ${hint?'Hide hint':'Give me a hint'}</button>
      ${res?`<button class="btn btn-ghost" data-act="retry">${ICON.undo} Try again</button>`:''}
      ${STATE.lang!=='en'?`<button class="btn btn-ghost" data-act="translate">${ICON.globe} Explain in ${esc(LANGS[STATE.lang])}</button>`:''}
    </div>`;
  if(hint) h+=`<div class="panel hint"><h4>Hint</h4><p>${nl2(q.hint)}</p></div>`;
  if(res==='correct') h+=`<div class="panel solved"><h4>Correct</h4><p>${nl2(q.explanation)}</p></div>`;
  if(res==='wrong') h+=`<div class="panel explain"><h4>How it works</h4><p>${nl2(q.explanation)}</p></div>`;
  if(tr) h+=`<div class="panel explain" lang="${STATE.lang}"><h4>For the parent — ${esc(LANGS[STATE.lang])}</h4><p>${nl2(tr)}</p></div>`;
  return h+`</section>`;
}
const tick=ok=>`<span class="tickbox ${ok?'ok':''}" aria-hidden="true"><svg viewBox="0 0 40 40">
  ${ok?'<path d="M7 21 L16 30 L33 9" style="--len:60"/>':'<path d="M10 10 L30 30 M30 10 L10 30" style="--len:58"/>'}</svg></span>`;

function renderField(q,f){
  const val=getAns(q,f.key), res=STATE.results[q.id];
  const ok=res?checkAnswer(f.check,val===undefined?'':val):null;
  const mark=ok===false?`<span class="mark no">answer: ${esc(answerText(f))}</span>`:'';
  const state=ok===true?'correct':ok===false?'incorrect':'';
  const id=`f-${q.id}-${f.key}`;
  if(f.input==='choice'||f.input==='multi'){
    const sel=f.input==='choice'?(val||''):(Array.isArray(val)?val:[]);
    return `<div class="field ${state}"><label id="${id}-l">${esc(f.label)}</label>
      <div class="choices" role="group" aria-labelledby="${id}-l">${f.options.map(o=>{
        const on=f.input==='choice'?sel===o:sel.includes(o); let ex='';
        if(res){ const isAns=f.check.kind==='choice'?f.check.value===o:(f.check.values||[]).includes(o);
          if(isAns) ex=' correct'; else if(on) ex=' incorrect'; }
        return `<button type="button" class="choice${ex}" aria-pressed="${on}" data-fk="${f.key}" data-opt="${esc(o)}" data-multi="${f.input==='multi'}">${esc(o)}</button>`;
      }).join('')}</div>${mark}</div>`;
  }
  return `<div class="field ${f.width?'w-'+f.width:''} ${state}">
    <label for="${id}">${esc(f.label)}</label>
    <input type="text" id="${id}" data-fk="${f.key}" autocomplete="off" spellcheck="false"
      value="${val===undefined?'':esc(val)}" placeholder="${esc(f.placeholder||'')}">${mark}</div>`;
}

function renderTable(q){
  const cols=q.table.head.length, ins=q.fields.filter(f=>f.inTable);
  let fi=0,rows='';
  q.table.rows.forEach(r=>{
    let cells=r.map(c=>`<td>${esc(c)}</td>`).join('');
    for(let c=r.length;c<cols;c++){ const f=ins[fi++];
      cells+=`<td>${f?tableInput(q,f):''}</td>`; }
    rows+=`<tr>${cells}</tr>`;
  });
  return `<div class="tbl-scroll"><table class="tbl"><thead><tr>${q.table.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function tableInput(q,f){
  const val=getAns(q,f.key), res=STATE.results[q.id];
  const ok=res?checkAnswer(f.check,val===undefined?'':val):null;
  return `<div class="field ${ok===true?'correct':ok===false?'incorrect':''}" style="gap:2px">
    <input type="text" data-fk="${f.key}" autocomplete="off" spellcheck="false" aria-label="${esc(f.label)}"
      value="${val===undefined?'':esc(val)}" placeholder="${esc(f.placeholder||'')}">
    ${ok===false?`<span class="mark no">${esc(answerText(f))}</span>`:''}</div>`;
}
function renderGrid(q){
  const f=q.fields.find(x=>x.input==='grid');
  const raw=getAns(q,f.key), sel=Array.isArray(raw)?raw:[], res=STATE.results[q.id];
  const target=f.check.values;
  let cells='';
  for(let n=1;n<=100;n++){
    const on=sel.includes(n); let ex='';
    if(res){ if(on&&target.includes(n)) ex=' hit'; else if(on) ex=' miss'; else if(target.includes(n)) ex=' missed-prime'; }
    cells+=`<button type="button" class="cellbtn${ex}" aria-pressed="${on}" data-cell="${n}" data-fk="${f.key}">${n}</button>`;
  }
  let lg=`<div class="grid-legend"><span><span class="swatch" style="background:var(--pen);border-color:var(--pen)"></span>your pick</span>`;
  if(res) lg+=`<span><span class="swatch" style="background:var(--green-wash);border-color:var(--green)"></span>found</span>
    <span><span class="swatch" style="background:var(--red-wash);border-color:var(--red)"></span>wrong</span>
    <span><span class="swatch" style="border-color:var(--amber);border-style:dashed"></span>missed</span>`;
  lg+=`<span class="count">selected: ${sel.length} of ${target.length}</span></div>`;
  return `<div class="grid100" role="group" aria-label="Numbers 1 to 100">${cells}</div>${lg}`;
}

/* ============================================================
   DIAGNOSTIC REPORT — grouped by skill, not by worksheet
   ============================================================ */
function renderReport(){
  const bySkill={};
  PACK.sheets.forEach(s=>{
    const k=s.skill||'unclassified';
    bySkill[k]=bySkill[k]||{skill:k,title:s.title,attempted:0,correct:0,total:0,weak:[]};
    s.questions.forEach(q=>{
      bySkill[k].total++;
      const r=STATE.results[q.id];
      if(r){ bySkill[k].attempted++;
        if(r==='correct') bySkill[k].correct++;
        else bySkill[k].weak.push({sheet:s,q}); }
    });
  });
  const rows=Object.values(bySkill);
  const attempted=rows.reduce((a,r)=>a+r.attempted,0);
  if(!attempted) return `<div class="sheet-head"><p class="eyebrow">Progress</p><h2>Nothing to report yet</h2>
    <p class="obj">Answer a few questions and this page will show which skills are solid and which ones need another go — grouped by skill, not by worksheet, because that is what a re-teach plan needs.</p></div>`;

  return `<div class="sheet-head"><p class="eyebrow">Progress</p><h2>What to practise next</h2>
    <p class="obj">${attempted} question${attempted>1?'s':''} attempted. Skills below 70% are worth revisiting before the next worksheet.</p></div>
    ${rows.filter(r=>r.attempted).sort((a,b)=>(a.correct/a.attempted)-(b.correct/b.attempted)).map(r=>{
      const pc=Math.round(r.correct/r.attempted*100);
      const band=pc>=85?'var(--green)':pc>=70?'var(--pen)':'var(--red)';
      return `<div class="q">
        <div class="q-head"><span class="q-no" style="background:${band};color:#fff">${pc}%</span>
        <p class="q-prompt">${esc(r.title)}<span class="sub">skill: ${esc(r.skill)} · ${r.correct} of ${r.attempted} attempted correct · ${r.total-r.attempted} not yet tried</span></p></div>
        ${r.weak.length?`<div class="panel explain"><h4>Go back to</h4>
          ${r.weak.map(w=>`<p><strong>WS${w.sheet.no} Q${esc(w.q.label)}</strong> — ${esc(w.q.prompt.slice(0,90))}${w.q.prompt.length>90?'…':''}</p>`).join('')}
        </div>`:`<div class="panel solved"><h4>Solid</h4><p>Every attempted question in this skill was correct.</p></div>`}
      </div>`;}).join('')}`;
}

/* ============================================================
   MARKING
   ============================================================ */
function grade(q){
  const a=STATE.answers[q.id]||{};
  if(!q.fields.some(f=>!isBlank(a[f.key]))) return null;
  const ok=q.fields.every(f=>checkAnswer(f.check,a[f.key]===undefined?'':a[f.key]));
  STATE.results[q.id]=ok?'correct':'wrong';
  return ok;
}
function checkQ(sheet,q){
  const r=grade(q);
  if(r===null){ toast('Write an answer first, then check'); return; }
  saveState(); rerender(sheet,q); toast(r?'Correct':'Not quite — read the explanation');
}
function rerender(sheet,q){
  const old=document.getElementById('qq-'+q.id); if(!old){ renderMain(); return; }
  const t=document.createElement('div'); t.innerHTML=renderQuestion(sheet,q);
  old.replaceWith(t.firstElementChild); updateMeter(); updateFoot(sheet);
}
function updateFoot(sheet){
  const el=document.querySelector('.sheet-foot .score'); if(!el) return;
  let c=0; sheet.questions.forEach(q=>{if(STATE.results[q.id]==='correct')c++;});
  el.innerHTML=`Worksheet ${sheet.no}: <strong>${c}</strong> of ${sheet.questions.length} questions correct`;
}
function updateMeter(){
  const all=allQuestions();
  const c=all.filter(({q})=>STATE.results[q.id]==='correct').length;
  document.getElementById('meterLabel').textContent=`${c} / ${all.length}`;
  document.getElementById('meterFill').style.width=(all.length?c/all.length*100:0)+'%';
}

/* ============================================================
   PARENT LANGUAGE LAYER
   ============================================================ */
const LANGS={en:'English',ta:'Tamil',hi:'Hindi',te:'Telugu',kn:'Kannada',ml:'Malayalam',mr:'Marathi',bn:'Bengali'};
async function translateQuestion(q){
  const key=q.id+':'+STATE.lang;
  if(STATE.i18n[key]) return;
  toast('Translating…');
  const prompt=`You are helping an Indian parent who does not speak English fluently support their child with school maths.
Rewrite the following in ${LANGS[STATE.lang]}, in simple everyday language a parent can read aloud.
Keep all numbers and mathematical symbols in Western digits. Do not add anything new. Return only the translation.

QUESTION: ${q.prompt}${q.sub?' '+q.sub:''}
HOW TO EXPLAIN IT: ${q.explanation}`;
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',content:prompt}]})
    });
    if(!res.ok) throw new Error('http '+res.status);
    const data=await res.json();
    const text=(data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n').trim();
    if(!text) throw new Error('empty');
    STATE.i18n[key]=text; saveState();
  }catch(e){
    STATE.i18n[key]='Translation is not available in this preview. In the app this call runs on your server, so it works offline of the browser and the result is cached against the question so it is only paid for once.';
  }
}

/* ============================================================
   EVENTS
   ============================================================ */
document.getElementById('tabs').addEventListener('click',e=>{
  const b=e.target.closest('.tab'); if(!b) return;
  view=b.dataset.view; buildTabs(); renderMain(); window.scrollTo({top:0,behavior:'smooth'});
});
document.getElementById('lang').addEventListener('change',e=>{
  STATE.lang=e.target.value; saveState(); renderMain();
  if(STATE.lang!=='en') toast('Open any question and press "Explain in '+LANGS[STATE.lang]+'"');
});

const MAIN=document.getElementById('main');
const qOf=el=>{const s=el.closest('.q'); if(!s||!s.dataset.qid) return null;
  const id=s.dataset.qid; const sheet=PACK.sheets.find(x=>x.questions.some(q=>q.id===id));
  return sheet?{sheet,q:sheet.questions.find(q=>q.id===id)}:null;};

MAIN.addEventListener('input',e=>{
  const i=e.target.closest('input[type="text"]'); if(!i) return;
  const c=qOf(i); if(c) setAns(c.q,i.dataset.fk,i.value);
});
MAIN.addEventListener('keydown',e=>{
  if(e.key!=='Enter') return;
  const i=e.target.closest('input[type="text"]'); if(!i) return;
  e.preventDefault(); const c=qOf(i); if(c) checkQ(c.sheet,c.q);
});
MAIN.addEventListener('click',async e=>{
  const cell=e.target.closest('.cellbtn');
  if(cell){ const c=qOf(cell); if(!c) return;
    const n=Number(cell.dataset.cell), prev=getAns(c.q,cell.dataset.fk);
    const cur=Array.isArray(prev)?[...prev]:[], ix=cur.indexOf(n);
    if(ix>-1) cur.splice(ix,1); else cur.push(n);
    setAns(c.q,cell.dataset.fk,cur);
    cell.setAttribute('aria-pressed',ix===-1); cell.classList.remove('hit','miss','missed-prime');
    const ct=cell.closest('.q').querySelector('.grid-legend .count');
    const f=c.q.fields.find(x=>x.input==='grid');
    if(ct) ct.textContent=`selected: ${cur.length} of ${f.check.values.length}`;
    return; }

  const ch=e.target.closest('.choice');
  if(ch){ const c=qOf(ch); if(!c) return;
    if(ch.dataset.multi==='true'){
      const prev=getAns(c.q,ch.dataset.fk), cur=Array.isArray(prev)?[...prev]:[];
      const ix=cur.indexOf(ch.dataset.opt);
      if(ix>-1) cur.splice(ix,1); else cur.push(ch.dataset.opt);
      setAns(c.q,ch.dataset.fk,cur); ch.setAttribute('aria-pressed',ix===-1);
    } else {
      setAns(c.q,ch.dataset.fk,ch.dataset.opt);
      ch.parentElement.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-pressed',b===ch));
    }
    return; }

  const btn=e.target.closest('[data-act]'); if(!btn) return;
  const act=btn.dataset.act, ctx=qOf(btn);
  if(act==='check'&&ctx) checkQ(ctx.sheet,ctx.q);
  else if(act==='hint'&&ctx){ STATE.hints[ctx.q.id]=!STATE.hints[ctx.q.id]; saveState(); rerender(ctx.sheet,ctx.q); }
  else if(act==='retry'&&ctx){ delete STATE.results[ctx.q.id]; saveState(); rerender(ctx.sheet,ctx.q); }
  else if(act==='translate'&&ctx){ await translateQuestion(ctx.q); rerender(ctx.sheet,ctx.q); }
  else if(act==='checkall'){ const sheet=sheetById(view); let n=0;
    sheet.questions.forEach(q=>{ if(grade(q)!==null) n++; });
    saveState(); renderMain(); toast(n?`Marked ${n} question${n>1?'s':''}`:'Type some answers first'); }
  else if(act==='clearall'){ const sheet=sheetById(view);
    sheet.questions.forEach(q=>{ delete STATE.answers[q.id]; delete STATE.results[q.id]; delete STATE.hints[q.id]; });
    saveState(); renderMain(); toast('Worksheet cleared'); }
});

/* ---- boot ---- */
(async function(){
  await loadState();
  const sel=document.getElementById('lang');
  sel.innerHTML=Object.entries(LANGS).map(([k,v])=>`<option value="${k}" ${k===STATE.lang?'selected':''}>${v}</option>`).join('');
  document.getElementById('packName').textContent=PACK.source.book;
  document.getElementById('packSub').textContent=
    `${PACK.curriculum.subject} · ${PACK.curriculum.stage} · converted from ${PACK.source.photoCount} photos`;
  buildTabs(); renderMain();
})();
