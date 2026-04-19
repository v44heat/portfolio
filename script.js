/* ── MATRIX RAIN ── */
(()=>{
  const c=document.getElementById('rain');
  const ctx=c.getContext('2d');
  const CH='アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&<>/\\{}[]';
  const FS=16;
  let W,H,cols,drops,spd,br;

  function init(){
    W=c.width=window.innerWidth;
    H=c.height=window.innerHeight;
    cols=Math.floor(W/FS);
    drops=Array.from({length:cols},()=>Math.random()*-(H/FS));
    spd  =Array.from({length:cols},()=>0.35+Math.random()*.9);
    br   =Array.from({length:cols},()=>0.5+Math.random()*.5);
  }

  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.04)';
    ctx.fillRect(0,0,W,H);

    for(let i=0;i<cols;i++){
      const x=i*FS;
      const y=drops[i]*FS;

      // head — white flash
      ctx.fillStyle=`rgba(220,255,230,${0.75+Math.random()*.25})`;
      ctx.font=`bold ${FS}px "Share Tech Mono",monospace`;
      ctx.fillText(CH[Math.floor(Math.random()*CH.length)],x,y);

      // neck — bright green
      ctx.fillStyle='rgba(0,255,65,0.95)';
      ctx.font=`${FS}px "Share Tech Mono",monospace`;
      ctx.fillText(CH[Math.floor(Math.random()*CH.length)],x,y-FS);

      // trail
      const tl=6+Math.floor(Math.random()*6);
      for(let t=2;t<tl;t++){
        const a=Math.max(0,(0.55-t*.075))*br[i];
        ctx.fillStyle=`rgba(0,${180+Math.random()*55},40,${a})`;
        ctx.fillText(CH[Math.floor(Math.random()*CH.length)],x,y-t*FS);
      }

      drops[i]+=spd[i];
      if(drops[i]*FS>H+FS*12&&Math.random()>.975){
        drops[i]=Math.random()*-25;
        spd[i]=0.35+Math.random()*.9;
        br[i]=0.5+Math.random()*.5;
      }
    }
  }

  init();
  setInterval(draw,33);
  let rt;
  window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(init,200)});
})();

(()=>{
  const traits=[
    '🎓 IT Student passionate about technology & problem solving',
    '🤖 Exploring Artificial Intelligence & Machine Learning',
    '🌐 Building modern web applications',
    '📊 Working with Data Analysis and visualization',
    '🚀 Always learning new tools and frameworks',
  ];
  const el=document.getElementById('tw');
  let ti=0,ci=0,del=false,pause=0;

  function tick(){
    if(pause>0){pause--;setTimeout(tick,50);return}
    const cur=traits[ti];
    if(!del){
      el.textContent=cur.slice(0,ci+1);
      ci++;
      if(ci===cur.length){del=true;pause=45}
      setTimeout(tick,58);
    } else {
      el.textContent=cur.slice(0,ci-1);
      ci--;
      if(ci===0){del=false;ti=(ti+1)%traits.length;pause=10}
      setTimeout(tick,26);
    }
  }
  setTimeout(tick,2200);
})();

/* ── GITHUB ── */
const GH='v44heat';
const grid=document.getElementById('grid');
const sdot=document.getElementById('sdot');
const stxt=document.getElementById('stxt');
const scnt=document.getElementById('scnt');
const srch=document.getElementById('search');
const rfBtn=document.getElementById('rfBtn');
const rfIco=document.getElementById('rfIco');
let allRepos=[];

const LC={
  JavaScript:'#f7df1e',Python:'#3572a5',HTML:'#e34c26',CSS:'#563d7c',
  TypeScript:'#3178c6',Java:'#b07219','C++':'#f34b7d','C#':'#178600',
  Ruby:'#701516',PHP:'#4f5d95',Vue:'#41b883',Rust:'#dea584',Go:'#00add8',
  Shell:'#89e051',Swift:'#f05138',Kotlin:'#a97bff',Dart:'#00b4ab',
};

function setS(type,msg){
  sdot.className='sdot'+(type==='ok'?'':' '+type);
  stxt.innerHTML=msg;
}
function isLive(r){return(r.homepage&&r.homepage.trim())||r.has_pages||r.name.includes('.github.io')}
function liveUrl(r){
  if(r.homepage&&r.homepage.trim())return r.homepage.trim();
  return`https://${r.owner?.login||GH}.github.io/${r.name}/`;
}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function cardHtml(r,d){
  const desc=r.description
    ?`<div class="rcdesc">${esc(r.description)}</div>`
    :`<div class="rcdesc none">// no description</div>`;
  const lc=LC[r.language]||'#6fbf4c';
  const lang=r.language?`<span class="rm"><span class="ld2" style="background:${lc}"></span>${r.language}</span>`:'';
  const stars=`<span class="rm"><i class="fas fa-star" style="color:#ffd700;font-size:.62rem"></i> ${r.stargazers_count}</span>`;
  const forks=`<span class="rm"><i class="fas fa-code-branch" style="color:var(--g2);font-size:.62rem"></i> ${r.forks_count}</span>`;
  const live=isLive(r)?`<a class="cb live" href="${liveUrl(r)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> LIVE</a>`:'';
  return`<div class="rc" style="animation-delay:${d}ms">
    <div class="rctop"><i class="fas fa-code-branch rcico"></i><div class="rcname">${esc(r.name)}</div></div>
    ${desc}
    <div class="rcmeta">${lang}${stars}${forks}</div>
    <div class="rcbtns">
      <a class="cb" href="${r.html_url}" target="_blank" rel="noopener"><i class="fab fa-github"></i> GITHUB</a>
      ${live}
    </div>
  </div>`;
}

function render(repos){
  if(!repos.length){
    grid.innerHTML=`<div class="smsg"><i class="fas fa-terminal si" style="color:var(--g2)"></i><p>No repositories match.</p></div>`;
    return;
  }
  grid.innerHTML=repos.map((r,i)=>cardHtml(r,i*38)).join('');
}

function applyFilter(){
  const q=srch.value.trim().toLowerCase();
  const f=q?allRepos.filter(r=>r.name.toLowerCase().includes(q)||(r.description||'').toLowerCase().includes(q)):allRepos;
  render(f);
  scnt.textContent=`[ ${f.length} / ${allRepos.length} ]`;
}

function animN(id,target){
  const el=document.getElementById(id);
  let cur=0;const step=Math.max(1,Math.ceil(target/35));
  const t=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=cur;if(cur>=target)clearInterval(t)},38);
}

async function fetchRepos(){
  setS('ld','Fetching repositories...');
  grid.innerHTML=`<div class="smsg"><i class="fas fa-circle-notch si spin" style="color:var(--g2)"></i><p>Loading repositories...</p></div>`;
  rfIco.style.animation='sp .8s linear infinite';
  rfBtn.disabled=true;scnt.textContent='';

  try{
    let page=1,repos=[];
    while(true){
      const res=await fetch(`https://api.github.com/users/${GH}/repos?type=public&sort=updated&per_page=100&page=${page}`,{headers:{Accept:'application/vnd.github.v3+json'}});
      if(!res.ok){
        if(res.status===403)throw new Error('GitHub API rate limit reached. Try again in a few minutes.');
        if(res.status===404)throw new Error(`User "${GH}" not found on GitHub.`);
        throw new Error(`GitHub API error ${res.status}`);
      }
      const batch=await res.json();
      repos=repos.concat(batch);
      if(batch.length<100)break;
      page++;
    }
    repos.sort((a,b)=>b.stargazers_count-a.stargazers_count||new Date(b.updated_at)-new Date(a.updated_at));
    allRepos=repos;
    applyFilter();
    animN('st-r',repos.length);
    animN('st-s',repos.reduce((a,r)=>a+r.stargazers_count,0));
    animN('st-l',new Set(repos.map(r=>r.language).filter(Boolean)).size);
    animN('st-f',repos.reduce((a,r)=>a+r.forks_count,0));
    const t=new Date().toLocaleTimeString('en-US',{hour12:false});
    setS('ok',`Last synced &nbsp;<strong style="color:var(--g0)">${t}</strong>`);
  }catch(err){
    setS('er',err.message);
    grid.innerHTML=`<div class="smsg"><i class="fas fa-exclamation-triangle si" style="color:#f66"></i><p style="color:#f88">${err.message}</p><button class="retbtn" onclick="fetchRepos()"><i class="fas fa-redo"></i> RETRY</button></div>`;
  }finally{
    rfIco.style.animation='';rfBtn.disabled=false;
  }
}

srch.addEventListener('input',applyFilter);
rfBtn.addEventListener('click',fetchRepos);
fetchRepos();
