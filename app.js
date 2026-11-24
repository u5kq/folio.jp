
const SOCIALS={
 instagram:{url:"https://www.instagram.com/",label:"Instagram",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1.2"/></svg>'},
 x:{url:"https://x.com/",label:"X",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20Z"/></svg>'},
 youtube:{url:"https://www.youtube.com/",label:"YouTube",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>'},
 tiktok:{url:"https://www.tiktok.com/",label:"TikTok",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.8 6.8 0 0 1-4.2-1.4v9.1a6.2 6.2 0 1 1-5.4-6.1v3.2a3.1 3.1 0 1 0 2.2 3V0h3.2c.2 2.4 1.7 4.2 4.2 4.5v2.6Z"/></svg>'}
};
document.querySelectorAll("[data-social]").forEach(a=>{const s=SOCIALS[a.dataset.social];if(!s)return;a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";a.innerHTML=s.svg;a.title=s.label+"（公式サイト）";a.setAttribute("aria-label",s.label+"公式サイトを開く")});
const nav=document.querySelector(".topbar nav"),menu=document.querySelector(".menu");
if(menu&&nav)menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"×":"☰"});
const header=document.querySelector(".topbar");
if(header){const theme=document.createElement("button");theme.className="theme-toggle";theme.type="button";theme.setAttribute("aria-label","表示テーマを切り替え");theme.title="表示テーマを切り替え";theme.innerHTML="◐";header.insertBefore(theme,menu||null);if(localStorage.getItem("folio-theme")==="dark")document.body.classList.add("dark");const sync=()=>theme.innerHTML=document.body.classList.contains("dark")?"☼":"◐";sync();theme.addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("folio-theme",document.body.classList.contains("dark")?"dark":"light");sync()})}
const progress=document.createElement("div");progress.className="scroll-progress";document.body.append(progress);
const topButton=document.createElement("button");topButton.className="to-top";topButton.type="button";topButton.textContent="↑";topButton.setAttribute("aria-label","ページ上部へ戻る");document.body.append(topButton);
const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%";topButton.classList.toggle("visible",scrollY>420)};addEventListener("scroll",updateScroll,{passive:true});updateScroll();topButton.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
const targets=document.querySelectorAll(".project-card,.project-row,.about-layout,.values,.contact-form,.statement .wrap");targets.forEach(el=>el.classList.add("reveal"));
if("IntersectionObserver"in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.08});targets.forEach(el=>io.observe(el))}else targets.forEach(el=>el.classList.add("is-visible"));
const list=document.querySelector(".project-list");if(list){const bar=document.createElement("div");bar.className="project-tools";bar.innerHTML='<input class="project-search" type="search" placeholder="プロジェクトを検索..." aria-label="プロジェクトを検索"><div class="filter-set" aria-label="カテゴリーで絞り込み"><button class="filter-chip" data-filter="all" aria-pressed="true">ALL</button><button class="filter-chip" data-filter="AI" aria-pressed="false">AI</button><button class="filter-chip" data-filter="WEB" aria-pressed="false">WEB</button><button class="filter-chip" data-filter="EDUCATION" aria-pressed="false">EDUCATION</button></div>';list.before(bar);const rows=[...list.querySelectorAll(".project-row")];let active="all";const search=bar.querySelector("input");const apply=()=>{let count=0;rows.forEach(row=>{const category=row.querySelector(".kicker").innerText.toUpperCase(),ok=(active==="all"||category.includes(active))&&row.innerText.toLowerCase().includes(search.value.toLowerCase());row.hidden=!ok;if(ok)count++});let empty=list.querySelector(".empty-state");if(!count&&!empty){empty=document.createElement("p");empty.className="empty-state";empty.textContent="該当するプロジェクトがありません。";list.append(empty)}else if(count&&empty)empty.remove()};search.addEventListener("input",apply);bar.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{active=b.dataset.filter;bar.querySelectorAll("[data-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()}))}
const form=document.querySelector("#contact-form");if(form)form.addEventListener("submit",event=>{event.preventDefault();const recipient="",error=document.querySelector("#form-error");if(!recipient){error.hidden=false;error.textContent="現在、送信先メールアドレスが設定されていません。公開前に安全な送信先設定が必要です。";return}const data=new FormData(form),subject=encodeURIComponent(data.get("subject")),body=encodeURIComponent("お名前: "+data.get("name")+"\n返信先: "+data.get("email")+"\n\n"+data.get("message"));location.href="mailto:"+recipient+"?subject="+subject+"&body="+body});


/* Project discovery tools */
const projectList=document.querySelector(".project-list");
if(projectList){
 const rows=[...projectList.querySelectorAll(".project-row")];
 const toolsBar=document.querySelector(".project-tools");
 if(toolsBar){
  const count=document.createElement("p");count.className="project-count";count.setAttribute("aria-live","polite");toolsBar.append(count);
  const search=toolsBar.querySelector(".project-search");
  const updateCount=()=>{const visible=rows.filter(r=>!r.hidden).length;count.textContent=visible+" / "+rows.length+" PROJECTS";};
  const originalApply=()=>{const active=toolsBar.querySelector('[aria-pressed="true"]')?.dataset.filter||"all";rows.forEach(row=>{const cat=row.querySelector(".kicker")?.textContent.toUpperCase()||"";row.hidden=!((active==="all"||cat.includes(active))&&row.textContent.toLowerCase().includes(search.value.toLowerCase()))});let empty=projectList.querySelector(".empty-state");if(!rows.some(r=>!r.hidden)){if(!empty){empty=document.createElement("p");empty.className="empty-state";empty.textContent="該当するプロジェクトがありません。検索語やカテゴリーを変更してください。";projectList.append(empty)}}else empty?.remove();updateCount();};
  search?.addEventListener("input",updateCount);toolsBar.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",updateCount));updateCount();
  document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();search?.focus()}if(e.key==="Escape"&&document.activeElement===search){search.value="";search.dispatchEvent(new Event("input"));search.blur()}});
  search?.setAttribute("placeholder","検索する... （ / ）");
 }
 rows.forEach(row=>{
  const action=document.createElement("button");action.className="project-share";action.type="button";action.textContent="COPY LINK ↗";action.setAttribute("aria-label",row.querySelector("h2")?.textContent+"のリンクをコピー");
  action.addEventListener("click",async()=>{const url=location.origin+location.pathname+"#"+row.id;try{await navigator.clipboard.writeText(url);action.textContent="COPIED ✓";setTimeout(()=>action.textContent="COPY LINK ↗",1800)}catch{action.textContent="コピーできません";setTimeout(()=>action.textContent="COPY LINK ↗",1800)}});
  const content=row.children[1];if(content)content.append(action);
 });
}
