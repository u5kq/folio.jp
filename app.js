/* folio — restrained, accessible page transitions */
(function(){
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 document.documentElement.classList.add("folio-ready");
 // A short first-visit brand reveal. No blocking loader on later page views.
 let seen=false;try{seen=sessionStorage.getItem("folio-intro-seen")==="1"}catch{}
 if(!reduce&&!seen){
  const splash=document.createElement("div");
  splash.className="folio-intro";
  splash.setAttribute("aria-hidden","true");
  splash.innerHTML='<div class="intro-inner"><span class="intro-word">folio<span>.</span></span><span class="intro-caption">IDEAS INTO SOMETHING REAL</span></div>';
  document.body.append(splash);
  requestAnimationFrame(()=>splash.classList.add("intro-active"));
  setTimeout(()=>{splash.classList.add("intro-out");try{sessionStorage.setItem("folio-intro-seen","1")}catch{}setTimeout(()=>splash.remove(),420)},620);
 }
 document.addEventListener("click",e=>{
  const a=e.target.closest("a[href]");
  if(!a||reduce||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank"||a.hasAttribute("download"))return;
  let url;try{url=new URL(a.href,location.href)}catch{return}
  if(url.origin!==location.origin||url.pathname===location.pathname||a.hasAttribute("data-no-transition"))return;
  e.preventDefault();
  const curtain=document.createElement("div");
  curtain.className="page-curtain";
  curtain.setAttribute("aria-hidden","true");
  curtain.innerHTML='<span>folio<span>.</span></span>';
  document.body.append(curtain);
  requestAnimationFrame(()=>curtain.classList.add("curtain-active"));
  setTimeout(()=>{location.href=url.href},160);
 });
})();

async function copyText(value){
 try{
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true}
 }catch(error){}
 const field=document.createElement("textarea");
 field.value=String(value);field.setAttribute("readonly","");
 field.style.position="fixed";field.style.opacity="0";field.style.pointerEvents="none";
 document.body.append(field);field.select();field.setSelectionRange(0,field.value.length);
 let copied=false;try{copied=document.execCommand("copy")}catch(error){}
 field.remove();
 if(!copied)throw new Error("Clipboard copy unavailable");
 return true;
}

const SOCIALS={
 instagram:{url:"https://www.instagram.com/",label:"Instagram",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1.2"/></svg>'},
 x:{url:"https://x.com/",label:"X",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20Z"/></svg>'},
 youtube:{url:"https://www.youtube.com/",label:"YouTube",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>'},
 tiktok:{url:"https://www.tiktok.com/",label:"TikTok",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.8 6.8 0 0 1-4.2-1.4v9.1a6.2 6.2 0 1 1-5.4-6.1v3.2a3.1 3.1 0 1 0 2.2 3V0h3.2c.2 2.4 1.7 4.2 4.2 4.5v2.6Z"/></svg>'}
};
document.querySelectorAll("[data-social]").forEach(a=>{const s=SOCIALS[a.dataset.social];if(!s)return;a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";a.innerHTML=s.svg;a.title=s.label+"公式サイト";a.setAttribute("aria-label",s.label+"公式サイトを開く")});
const header=document.querySelector(".topbar"),nav=header?.querySelector("nav"),menu=header?.querySelector(".menu");

if(header){const theme=document.createElement("button");theme.type="button";theme.className="theme-toggle";theme.setAttribute("aria-label","テーマを切り替える");theme.title="ライト／ダーク切り替え";header.insertBefore(theme,menu||null);try{if(localStorage.getItem("folio-theme")==="dark")document.body.classList.add("dark")}catch{}const sync=()=>{theme.textContent=document.body.classList.contains("dark")?"☀":"◐";theme.setAttribute("aria-pressed",String(document.body.classList.contains("dark")))};sync();theme.addEventListener("click",()=>{document.body.classList.toggle("dark");try{localStorage.setItem("folio-theme",document.body.classList.contains("dark")?"dark":"light")}catch{}sync()})}
const progress=document.createElement("div");progress.className="scroll-progress";progress.setAttribute("aria-hidden","true");document.body.append(progress);
const reveal=document.querySelectorAll(".project-card,.project-row,.about-layout,.values,.contact-form,.statement .wrap");if("IntersectionObserver"in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target)}}),{threshold:.06});reveal.forEach(el=>{el.classList.add("reveal");observer.observe(el)})}else reveal.forEach(el=>el.classList.add("is-visible"));
const list=document.querySelector(".project-list");
if(list){
 const rows=[...list.querySelectorAll(".project-row")],bar=document.createElement("section");bar.className="project-tools";bar.setAttribute("aria-label","プロジェクト検索と絞り込み");
 bar.innerHTML='<div class="project-tools-top"><label class="project-search-wrap"><span>SEARCH PROJECTS</span><input class="project-search" type="search" placeholder="プロジェクト名・キーワード" aria-label="プロジェクトを検索"></label><label class="sort-wrap"><span>SORT BY</span><select class="project-sort" aria-label="並び替え"><option value="default">おすすめ順</option><option value="az">名前順 A–Z</option><option value="za">名前順 Z–A</option></select></label></div><div class="filter-heading">CATEGORY</div><div class="filter-set"><button class="filter-chip" data-filter="all" aria-pressed="true">すべて</button><button class="filter-chip" data-filter="AI" aria-pressed="false">AI</button><button class="filter-chip" data-filter="WEB" aria-pressed="false">WEB</button><button class="filter-chip" data-filter="EDUCATION" aria-pressed="false">EDUCATION</button><button class="filter-chip" data-filter="DIGITAL" aria-pressed="false">DIGITAL</button></div><div class="filter-heading">STATUS</div><div class="filter-set"><button class="stage-chip" data-stage="all" aria-pressed="true">すべて</button><button class="stage-chip" data-stage="IN DEVELOPMENT" aria-pressed="false">開発中</button><button class="stage-chip" data-stage="CONCEPT" aria-pressed="false">構想</button><button class="stage-chip" data-stage="PROJECT" aria-pressed="false">プロジェクト</button><button class="stage-chip" data-stage="STUDY PROJECT" aria-pressed="false">学習サイト</button></div><div class="project-tools-bottom"><p class="project-count" aria-live="polite"></p><div class="view-switch"><button type="button" data-view="list" aria-pressed="true">LIST</button><button type="button" data-view="compact" aria-pressed="false">COMPACT</button><button type="button" class="reset-filters">RESET</button></div></div>';
 list.before(bar);
 const search=bar.querySelector(".project-search"),sort=bar.querySelector(".project-sort"),count=bar.querySelector(".project-count");let category="all",stage="all";const order=new Map(rows.map((r,i)=>[r,i]));
 const apply=()=>{const term=search.value.trim().toLocaleLowerCase();rows.forEach(row=>{const cat=row.querySelector(".kicker")?.textContent.toUpperCase()||"",st=row.querySelector(".status")?.textContent.trim().toUpperCase()||"";row.hidden=!((category==="all"||cat.includes(category))&&(stage==="all"||st===stage)&&row.textContent.toLocaleLowerCase().includes(term))});const shown=rows.filter(r=>!r.hidden);shown.sort((a,b)=>sort.value==="az"?a.querySelector("h2").textContent.localeCompare(b.querySelector("h2").textContent,"ja"):sort.value==="za"?b.querySelector("h2").textContent.localeCompare(a.querySelector("h2").textContent,"ja"):order.get(a)-order.get(b));shown.forEach(r=>list.append(r));let empty=list.querySelector(".empty-state");if(!shown.length){if(!empty){empty=document.createElement("p");empty.className="empty-state";empty.textContent="該当するプロジェクトがありません。条件を変更してください。";list.append(empty)}}else empty?.remove();count.textContent=shown.length+" / "+rows.length+" PROJECTS"};
 search.addEventListener("input",apply);sort.addEventListener("change",apply);
 bar.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.filter;bar.querySelectorAll("[data-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()}));
 bar.querySelectorAll("[data-stage]").forEach(b=>b.addEventListener("click",()=>{stage=b.dataset.stage;bar.querySelectorAll("[data-stage]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));apply()}));
 bar.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{list.classList.toggle("compact-view",b.dataset.view==="compact");bar.querySelectorAll("[data-view]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)))}));
 bar.querySelector(".reset-filters").addEventListener("click",()=>{search.value="";sort.value="default";category=stage="all";bar.querySelectorAll("[data-filter],[data-stage]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.filter==="all"||x.dataset.stage==="all")));list.classList.remove("compact-view");bar.querySelectorAll("[data-view]").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.view==="list")));apply()});
 document.addEventListener("keydown",e=>{if(e.key==="/"&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();search.focus()}if(e.key==="Escape"&&document.activeElement===search){search.value="";apply();search.blur()}});
 rows.forEach(row=>{const btn=document.createElement("button");btn.type="button";btn.className="project-share";btn.textContent="リンクをコピー ↗";btn.addEventListener("click",async()=>{try{await copyText(location.href.split("#")[0]+"#"+row.id);btn.textContent="コピーしました ✓"}catch{btn.textContent="コピーできませんでした"}setTimeout(()=>btn.textContent="リンクをコピー ↗",1600)});row.children[1]?.append(btn)});apply();
}
const form=document.querySelector("#contact-form");if(form)form.addEventListener("submit",e=>{e.preventDefault();const error=document.querySelector("#form-error");if(error){error.hidden=false;error.textContent="現在、送信先が未設定のため送信できません。公開前に安全な送信先設定が必要です。"}});

const projectData={
studyplan:{name:"StudyPlan AI",category:"EDUCATION / PRODUCTIVITY",status:"IN DEVELOPMENT",summary:"学習タスク・固定予定・進捗をまとめ、日々の学習計画を組み立てるツール。",purpose:"学習に必要な予定やタスクを一か所で整理し、無理のない計画づくりを支援すること。",scope:"タスク登録・学習時間の設定・固定予定の管理を中心に開発中。自動調整や振り返りは構想を含みます。",note:"自動調整などの機能は実装済みと断定せず、今後の構想として扱います。"},
myai:{name:"MY AI",category:"AI / PERSONAL ASSISTANT",status:"CONCEPT",summary:"自分の考え方や判断基準を大切にするパーソナルAI構想。",purpose:"根拠と推測を分け、優先順位と実行しやすい行動を示すAI体験を考えること。",scope:"個人向けAIアシスタントの構想・要件整理段階。",note:"構想段階。完成済みのアプリや機能としては紹介していません。"},
socialquiz:{name:"Social Quiz",category:"EDUCATION / WEB",status:"PROJECT",summary:"社会科の知識をクイズ形式で確認できる学習サイト。",purpose:"社会科の内容を問題形式で確認し、繰り返し学習しやすくすること。",scope:"社会科クイズサイトとして企画・制作。",note:"問題数や進捗機能などの詳細は、確認でき次第更新します。"},
qrpay:{name:"QR PAY",category:"UI / DIGITAL EXPERIENCE",status:"IN DEVELOPMENT",summary:"QRコードを使った支払いの流れを題材に、利用者向け・店舗側の画面体験を考えるプロジェクト。",purpose:"支払う人と店舗の双方にとって、わかりやすい決済体験を設計すること。",scope:"利用者向け画面・店舗向け画面などのUIと機能を検討・制作中。",note:"画面制作・コンセプトのプロジェクトです。実際の決済サービスではありません。"},
seatlabo:{name:"Seat Labo",category:"WEB / UTILITY",status:"PROJECT",summary:"席替えや座席管理をサポートするツール。",purpose:"座席の配置や管理をわかりやすく行えるようにすること。",scope:"操作性と利用場面を意識した機能設計・制作。",note:"詳細な機能仕様は整理中です。"},
reception:{name:"Home Reception",category:"WEB / SYSTEM",status:"IN DEVELOPMENT",summary:"来客受付をデジタル化するサイト。",purpose:"来客者の受付と管理者による確認をシンプルにすること。",scope:"受付フォーム・管理者向け一覧・端末表示などを開発中。",note:"実装済み機能と今後の改善項目は、検証後に順次追記します。"},
"nine-subjects":{name:"9科テスト対策",category:"EDUCATION / EXAM PREPARATION",status:"STUDY PROJECT",summary:"9科目から教科を選び、クイズに挑戦する学習サイト。",purpose:"9教科の学習内容をクイズ形式で確認し、教科を選んで取り組めるようにすること。",scope:"国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭を対象とするクイズ学習サイトとして企画。",note:"9科目のクイズサイトです。学習管理アプリではありません。",subjects:["国語","数学","英語","理科","社会","音楽","美術","保健体育","技術家庭"]}
};
const detailRoot=document.querySelector("#project-detail");
if(detailRoot){
 const id=new URLSearchParams(location.search).get("id"),d=projectData[id];
 if(!d){detailRoot.innerHTML='<div class="eyebrow"><i></i> PROJECT NOT FOUND</div><h1 class="page-title">Project not found.</h1><p class="lead">指定されたプロジェクトが見つかりませんでした。</p><a class="text-link" href="projects.html">← プロジェクト一覧へ戻る</a>'}
 else{
 document.title=d.name+" — folio";
 const subjects=d.subjects?'<div class="detail-subjects">'+d.subjects.map(s=>'<span>'+s+'</span>').join("")+'</div>':"";
 detailRoot.innerHTML='<div class="eyebrow"><i></i> PROJECT / '+d.category+'</div><a class="back-link" href="projects.html">← ALL PROJECTS</a><h1 class="page-title detail-title">'+d.name+'<span>.</span></h1><div class="detail-meta"><span class="status">'+d.status+'</span><span class="detail-id">PROJECT / '+id.toUpperCase()+'</span></div><p class="detail-summary">'+d.summary+'</p><div class="detail-layout"><section class="detail-panel"><span class="kicker">01 / PURPOSE</span><h2>このプロジェクトについて</h2><p>'+d.purpose+'</p></section><section class="detail-panel"><span class="kicker">02 / SCOPE</span><h2>取り組み・機能の範囲</h2><p>'+d.scope+'</p>'+subjects+'</section><section class="detail-panel detail-note"><span class="kicker">03 / DEVELOPMENT NOTE</span><h2>開発状況について</h2><p>'+d.note+'</p><p class="detail-disclaimer">掲載内容は現在整理できている情報です。未確認の機能を実装済みとして掲載していません。</p></section></div><div class="detail-bottom"><a class="text-link" href="projects.html">← すべてのプロジェクト</a><a class="text-link" href="contact.html">CONTACT ↗</a></div>';
 }
}

/* Detail-page utilities: share, reading progress and section navigation */
if(document.querySelector("#project-detail")){
 const root=document.querySelector("#project-detail");
 const toolsBar=document.createElement("div");toolsBar.className="detail-actions";
 toolsBar.innerHTML='<button type="button" class="detail-action" data-copy>リンクをコピー <span>↗</span></button><button type="button" class="detail-action" data-share>共有する <span>⌁</span></button>';
 root.prepend(toolsBar);
 toolsBar.querySelector("[data-copy]").addEventListener("click",async e=>{const b=e.currentTarget;try{await copyText(location.href);b.textContent="コピーしました ✓"}catch{b.textContent="コピーできませんでした"}setTimeout(()=>b.innerHTML='リンクをコピー <span>↗</span>',1800)});
 toolsBar.querySelector("[data-share]").addEventListener("click",async e=>{const b=e.currentTarget;if(navigator.share){try{await navigator.share({title:document.title,url:location.href})}catch(err){if(err.name!=="AbortError")b.textContent="共有できません"}}else{try{await copyText(location.href);b.textContent="URLをコピーしました ✓"}catch{b.textContent="共有に対応していません"}}});
 const meter=document.createElement("div");meter.className="reading-meter";meter.innerHTML="<i></i>";document.body.append(meter);
 const updateMeter=()=>{const max=document.documentElement.scrollHeight-innerHeight;meter.firstElementChild.style.width=(max>0?scrollY/max*100:0)+"%"};addEventListener("scroll",updateMeter,{passive:true});updateMeter();
 const back=document.createElement("a");back.href="projects.html";back.className="detail-back-floating";back.textContent="← PROJECTS";document.body.append(back);
}








/* Single, accessible navigation controller */
(function(){
 const header=document.querySelector(".topbar");
 const nav=header&&header.querySelector("nav");
 const button=header&&header.querySelector(".menu");
 if(!header||!nav||!button)return;
 nav.id="folio-main-nav";
 button.setAttribute("aria-controls",nav.id);
 const close=()=>{nav.classList.remove("open");button.setAttribute("aria-expanded","false");button.textContent="☰"};
 const open=()=>{nav.classList.add("open");button.setAttribute("aria-expanded","true");button.textContent="×"};
 const current=location.pathname.split("/").pop()||"index.html";
 nav.querySelectorAll("a[href]").forEach(link=>{
  const target=new URL(link.href,location.href).pathname.split("/").pop()||"index.html";
  const active=target===current||(current==="project.html"&&target==="projects.html");
  if(active){link.classList.add("active");link.setAttribute("aria-current","page")}
  link.addEventListener("click",close);
 });
 button.addEventListener("click",()=>nav.classList.contains("open")?close():open());
 document.addEventListener("pointerdown",event=>{if(nav.classList.contains("open")&&!header.contains(event.target))close()});
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&nav.classList.contains("open")){close();button.focus()}});
})();


/* Homepage project discovery: instant search and category filters */
(function(){
 const grid=document.querySelector(".project-grid"),input=document.querySelector("#home-project-search");
 if(!grid||!input)return;
 const cards=[...grid.querySelectorAll(".project-card")],count=document.querySelector("#home-project-count");let category="all";
 const update=()=>{const term=input.value.trim().toLocaleLowerCase();let visible=0;cards.forEach(card=>{const text=card.textContent.toLocaleLowerCase(),tag=card.querySelector(".project-no")?.textContent.toUpperCase()||"";const categoryMatch=category==="all"||(category==="LEARNING"&&tag.includes("LEARNING"))||(category!=="LEARNING"&&tag.includes(category));card.hidden=!(categoryMatch&&(!term||text.includes(term)));if(!card.hidden)visible++});if(count)count.textContent=String(visible).padStart(2,"0")+" / "+String(cards.length).padStart(2,"0")+" PROJECTS"};
 input.addEventListener("input",update);
 input.addEventListener("keydown",e=>{if(e.key==="Escape"){input.value="";update();input.blur()}});
 document.querySelectorAll("[data-home-filter]").forEach(button=>button.addEventListener("click",()=>{category=button.dataset.homeFilter;document.querySelectorAll("[data-home-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));update()}));
})();


/* folio corporate utilities: global search, utility navigation, accessible shortcuts */
(function(){
 const header=document.querySelector(".topbar");
 if(header){
  const nav=header.querySelector("nav");
  if(nav){
   [["FAQ","faq.html"],["SITE MAP","sitemap.html"]].forEach(([label,href])=>{
    if(!nav.querySelector('a[href="'+href+'"]')){
     const a=document.createElement("a");a.href=href;a.textContent=label;nav.append(a);
    }
   });
  }
  if(!header.querySelector(".global-search-trigger")){
   const b=document.createElement("button");b.type="button";b.className="global-search-trigger";b.setAttribute("aria-label","サイト内検索");b.title="サイト内検索 ( / )";b.innerHTML='<span aria-hidden="true">⌕</span><small>SEARCH</small>';header.insertBefore(b,header.querySelector(".menu")||null);
   const overlay=document.createElement("div");overlay.className="search-overlay";overlay.hidden=true;
   overlay.innerHTML='<section class="search-dialog" role="dialog" aria-modal="true" aria-label="サイト内検索"><div class="search-dialog-head"><b>Search folio<span>.</span></b><button type="button" class="search-close" aria-label="閉じる">×</button></div><label class="global-search-label"><span>SEARCH THE SITE</span><input type="search" class="global-search-input" placeholder="プロジェクト・ページ・キーワードを検索" autocomplete="off"></label><p class="search-hint">キーワードを入力すると、関連ページを表示します。</p><div class="global-search-results" aria-live="polite"></div><div class="search-dialog-foot"><span>ESC TO CLOSE</span><span>FOLIO / SITE SEARCH</span></div></section>';
   document.body.append(overlay);
   const input=overlay.querySelector("input"),results=overlay.querySelector(".global-search-results"),close=()=>{overlay.hidden=true;b.focus()};
   const entries=[
    ["HOME","トップページ・folioの紹介","index.html","ブランド / スタジオ / ホーム"],
    ["PROJECTS","すべてのプロジェクト一覧","projects.html","開発 / プロジェクト / 一覧"],
    ["StudyPlan AI","学習計画・タスク管理プロジェクト","project.html?id=studyplan","学習 / 計画 / AI"],
    ["MY AI","パーソナルAI構想","project.html?id=myai","AI / アシスタント"],
    ["Social Quiz","社会科クイズ学習サイト","project.html?id=socialquiz","社会 / クイズ"],
    ["QR PAY","QR決済体験のUI・機能開発","project.html?id=qrpay","決済 / QR / デジタル"],
    ["Seat Labo","席替え・座席管理ツール","project.html?id=seatlabo","座席 / 管理"],
    ["Home Reception","来客受付システム","project.html?id=reception","受付 / システム"],
    ["9科テスト対策","9科目から選んでクイズに挑戦する学習サイト","project.html?id=nine-subjects","国語 / 数学 / 英語 / 理科 / 社会 / 音楽 / 美術 / 保健体育 / 技術家庭"],
    ["BRAND","Mission・Vision・Values","brand.html","ブランド / 価値観"],
    ["NEWS","お知らせ・サイト更新情報","news.html","ニュース / 更新"],
    ["ABOUT","folioについて","about.html","概要 / 制作方針"],
    ["CONTACT","お問い合わせ","contact.html","連絡 / 問い合わせ"],
    ["FAQ","よくある質問","faq.html","質問 / 利用 / 情報"],
    ["SITE MAP","サイト全体のページ一覧","sitemap.html","サイトマップ / ページ"]
   ];
   const render=()=>{
    const q=input.value.trim().toLocaleLowerCase("ja");results.replaceChildren();
    if(!q){results.textContent="検索したい言葉を入力してください。";return}
    const found=entries.filter(x=>x.join(" ").toLocaleLowerCase("ja").includes(q)).slice(0,8);
    if(!found.length){results.textContent="一致するページがありません。別のキーワードをお試しください。";return}
    found.forEach(x=>{const a=document.createElement("a");a.className="global-search-result";a.href=x[2];const t=document.createElement("span");t.textContent=x[0];const d=document.createElement("small");d.textContent=x[1];const arrow=document.createElement("i");arrow.textContent="↗";a.append(t,d,arrow);results.append(a)});
   };
   b.addEventListener("click",()=>{overlay.hidden=false;input.value="";render();setTimeout(()=>input.focus(),30)});
   overlay.querySelector(".search-close").addEventListener("click",close);
   overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
   input.addEventListener("input",render);
   document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!overlay.hidden)close();
    if((e.key==="/"||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"))&&!/input|textarea|select/i.test(document.activeElement.tagName)){
     e.preventDefault();b.click();
    }
   });
  }
 }
 document.querySelectorAll(".footer").forEach(f=>{
  if(!f.querySelector(".footer-utility-links")){
   const links=document.createElement("div");links.className="footer-utility-links";
   [["FAQ","faq.html"],["SITE MAP","sitemap.html"]].forEach(([t,u])=>{const a=document.createElement("a");a.href=u;a.textContent=t;links.append(a)});
   f.append(links);
  }
 });
})();


/* Lightweight visitor tools: favorites, recently viewed, font sizing, FAQ search */
(function(){
 const KEY_FAV="folio-favorites-v1",KEY_RECENT="folio-recent-v1";
 const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
 const ids=["studyplan","myai","socialquiz","qrpay","seatlabo","reception","nine-subjects"];
 const names={studyplan:"StudyPlan AI",myai:"MY AI",socialquiz:"Social Quiz",qrpay:"QR PAY",seatlabo:"Seat Labo",reception:"Home Reception","nine-subjects":"9科テスト対策"};
 const link=id=>"project.html?id="+encodeURIComponent(id);
 const addRecent=id=>{if(!ids.includes(id))return;const a=[id,...read(KEY_RECENT).filter(x=>x!==id)].slice(0,6);write(KEY_RECENT,a)};
 const current=new URLSearchParams(location.search).get("id");
 if(current)addRecent(current);
 const favs=read(KEY_FAV);
 const makeFav=(id)=>{const b=document.createElement("button");b.type="button";b.className="folio-favorite";b.dataset.favorite=id;const sync=()=>{const on=read(KEY_FAV).includes(id);b.textContent=on?"♥ 保存済み":"♡ お気に入り";b.setAttribute("aria-pressed",String(on))};sync();b.addEventListener("click",()=>{let a=read(KEY_FAV);a=a.includes(id)?a.filter(x=>x!==id):[id,...a];write(KEY_FAV,a);sync();document.dispatchEvent(new CustomEvent("folio:favorites-change"))});return b};
 const rows=[...document.querySelectorAll(".project-row")];
 rows.forEach(row=>{if(ids.includes(row.id)){const action=row.querySelector(".detail-cta");if(action&&!row.querySelector(".folio-favorite"))action.before(makeFav(row.id))}});
 const detail=document.querySelector("#project-detail");
 if(current&&detail&&ids.includes(current)){const actions=detail.querySelector(".detail-actions")||detail; if(!actions.querySelector(".folio-favorite"))actions.prepend(makeFav(current))}
 const list=document.querySelector(".project-list");
 if(list){
  const bar=document.createElement("div");bar.className="folio-library-tools";
  const title=document.createElement("strong");title.textContent="MY FOLIO";
  const saved=document.createElement("span");saved.className="folio-saved-count";
  const recent=document.createElement("span");recent.className="folio-recent-count";
  const toggle=document.createElement("button");toggle.type="button";toggle.textContent="お気に入りだけ表示";toggle.setAttribute("aria-pressed","false");
  const applySaved=()=>{const active=toggle.getAttribute("aria-pressed")==="true";const favorites=read(KEY_FAV);list.querySelectorAll(".project-row").forEach(row=>row.classList.toggle("favorite-hidden",active&&!favorites.includes(row.id)));saved.textContent=favorites.length+" SAVED";recent.textContent="RECENT: "+(read(KEY_RECENT).map(x=>names[x]).filter(Boolean).slice(0,3).join(" · ")||"閲覧履歴なし");toggle.textContent=active?"すべて表示":"お気に入りだけ表示"};
  toggle.addEventListener("click",()=>{toggle.setAttribute("aria-pressed",String(toggle.getAttribute("aria-pressed")!=="true"));applySaved()});
  bar.append(title,saved,recent,toggle);list.before(bar);applySaved();
  document.addEventListener("folio:favorites-change",applySaved);
 }
 const faq=document.querySelector(".faq-list");
 if(faq){const wrap=document.createElement("label");wrap.className="faq-search";wrap.innerHTML='<span>SEARCH FAQ</span><input type="search" placeholder="質問・キーワードを検索" aria-label="FAQを検索">';faq.before(wrap);const input=wrap.querySelector("input");input.addEventListener("input",()=>{const q=input.value.trim().toLocaleLowerCase();faq.querySelectorAll("details").forEach(d=>d.hidden=!d.textContent.toLocaleLowerCase().includes(q))})}
 const pageShare=document.createElement("button");pageShare.type="button";pageShare.className="page-share-button";pageShare.textContent="このページを共有 ↗";pageShare.addEventListener("click",async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await copyText(location.href);pageShare.textContent="URLをコピーしました ✓"}}catch(e){if(e.name!=="AbortError")pageShare.textContent="共有できませんでした"}setTimeout(()=>pageShare.textContent="このページを共有 ↗",1800)});
 const footer=document.querySelector(".footer");if(footer&&!footer.querySelector(".page-share-button"))footer.append(pageShare);
})();


/* folio information hub: useful quick links, project comparison and print support */
(function(){
 const extra=[
  ["JOURNAL","journal.html","制作ノート・開発の考え方"],
  ["RELEASES","releases.html","公開・更新履歴"],
  ["TECHNOLOGY","technology.html","制作領域・技術方針"],
  ["TIMELINE","timeline.html","活動の歩み"],
  ["PARTNERSHIP","partnership.html","協力・共同制作について"],
  ["PRIVACY","privacy.html","プライバシーについて"]
 ];
 document.querySelectorAll(".footer").forEach(footer=>{
  if(footer.querySelector(".folio-more-links"))return;
  const box=document.createElement("div");box.className="folio-more-links";
  const label=document.createElement("span");label.textContent="EXPLORE FOLIO";
  const links=document.createElement("div");
  extra.forEach(([name,url,desc])=>{const a=document.createElement("a");a.href=url;a.textContent=name;a.title=desc;links.append(a)});
  box.append(label,links);footer.append(box);
 });
 const projects=document.querySelector(".project-list");
 if(projects&&!projects.querySelector(".compare-launch")){
  const rows=[...projects.querySelectorAll(".project-row")];
  const launch=document.createElement("div");launch.className="compare-launch";
  launch.innerHTML='<div><b>PROJECT COMPARE</b><small>気になるプロジェクトを選んで比較できます</small></div><button type="button">比較をはじめる ↗</button>';
  projects.before(launch);
  const modal=document.createElement("div");modal.className="compare-modal";modal.hidden=true;
  modal.innerHTML='<section class="compare-panel" role="dialog" aria-modal="true" aria-label="プロジェクト比較"><header><div><b>Compare projects.</b><small>最大3つまで選択できます</small></div><button type="button" class="compare-close" aria-label="閉じる">×</button></header><div class="compare-options"></div><div class="compare-result" aria-live="polite"></div><footer><button type="button" class="compare-reset">リセット</button><button type="button" class="compare-show">選択したプロジェクトを比較</button></footer></section>';
  document.body.append(modal);
  const options=modal.querySelector(".compare-options"),result=modal.querySelector(".compare-result");
  rows.forEach(row=>{const id=row.id,name=row.querySelector("h2")?.textContent||id,desc=row.querySelector("p")?.textContent||"",status=row.querySelector(".status")?.textContent||"未設定",cat=row.querySelector(".kicker")?.textContent||"未分類";const label=document.createElement("label");label.className="compare-option";const input=document.createElement("input");input.type="checkbox";input.value=id;const text=document.createElement("span");text.innerHTML="<b></b><small></small>";text.querySelector("b").textContent=name;text.querySelector("small").textContent=cat+" · "+status;label.append(input,text);options.append(label);input.addEventListener("change",()=>{const checked=[...options.querySelectorAll("input:checked")];if(checked.length>3){input.checked=false;return}modal.querySelector(".compare-show").disabled=checked.length<2})});
  const close=()=>{modal.hidden=true;launch.querySelector("button").focus()};
  launch.querySelector("button").addEventListener("click",()=>{modal.hidden=false;modal.querySelector(".compare-show").disabled=true;result.replaceChildren()});
  modal.querySelector(".compare-close").addEventListener("click",close);
  modal.addEventListener("click",e=>{if(e.target===modal)close()});
  modal.querySelector(".compare-reset").addEventListener("click",()=>{options.querySelectorAll("input").forEach(x=>x.checked=false);result.replaceChildren();modal.querySelector(".compare-show").disabled=true});
  modal.querySelector(".compare-show").addEventListener("click",()=>{result.replaceChildren();const chosen=[...options.querySelectorAll("input:checked")];const table=document.createElement("div");table.className="compare-table";chosen.forEach(input=>{const row=rows.find(r=>r.id===input.value);const card=document.createElement("article");card.innerHTML="<h3></h3><span></span><p></p><a>詳細を見る ↗</a>";card.querySelector("h3").textContent=row.querySelector("h2")?.textContent||input.value;card.querySelector("span").textContent=row.querySelector(".status")?.textContent||"未設定";card.querySelector("p").textContent=row.querySelector("p")?.textContent||"";card.querySelector("a").href="project.html?id="+encodeURIComponent(input.value);table.append(card)});result.append(table)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.hidden)close()});
 }
 const print=document.createElement("button");print.type="button";print.className="print-page";print.textContent="ページを印刷 ↗";print.addEventListener("click",()=>window.print());
 const foot=document.querySelector(".footer");if(foot&&!foot.querySelector(".print-page"))foot.append(print);
})();


/* Final usability touches: breadcrumb, back-to-top, recent projects, 404 recovery */
(function(){
 const path=location.pathname.split("/").pop()||"index.html";
 const labels={"index.html":"HOME","projects.html":"PROJECTS","project.html":"PROJECT","brand.html":"BRAND","news.html":"NEWS","about.html":"ABOUT","contact.html":"CONTACT","faq.html":"FAQ","sitemap.html":"SITEMAP","journal.html":"JOURNAL","releases.html":"RELEASES","technology.html":"TECHNOLOGY","timeline.html":"TIMELINE","partnership.html":"PARTNERSHIP","privacy.html":"PRIVACY","404.html":"NOT FOUND"};
 const main=document.querySelector("main");
 if(main&&path!=="index.html"&&!main.querySelector(".folio-breadcrumb")){
  const crumb=document.createElement("nav");crumb.className="folio-breadcrumb";crumb.setAttribute("aria-label","パンくずリスト");
  const home=document.createElement("a");home.href="index.html";home.textContent="HOME";
  const sep=document.createElement("span");sep.textContent="/";
  const current=document.createElement("span");current.textContent=labels[path]||"PAGE";current.setAttribute("aria-current","page");
  crumb.append(home,sep,current);main.prepend(crumb);
 }
 if(!document.querySelector(".folio-top-button")){
  const top=document.createElement("button");top.type="button";top.className="folio-top-button";top.setAttribute("aria-label","ページの先頭へ戻る");top.textContent="↑";document.body.append(top);
  const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+"%";top.classList.toggle("is-visible",window.scrollY>420)};
  window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);update();
  top.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
 }
 try{
  if(path==="project.html"){
   const id=new URLSearchParams(location.search).get("id");
   if(id){const key="folio_recent_projects_v1";let list=JSON.parse(localStorage.getItem(key)||"[]");list=[id,...list.filter(x=>x!==id)].slice(0,6);localStorage.setItem(key,JSON.stringify(list))}
  }
  if(path==="projects.html"){
   const recent=JSON.parse(localStorage.getItem("folio_recent_projects_v1")||"[]");
   const rows=[...document.querySelectorAll(".project-row")],found=recent.map(id=>rows.find(row=>row.id===id)).filter(Boolean);
   if(found.length){const section=document.createElement("section");section.className="folio-recent";const heading=document.createElement("div");heading.className="folio-recent-heading";heading.innerHTML="<span>YOUR HISTORY</span><h2>Recently viewed.</h2>";const list=document.createElement("div");list.className="folio-recent-list";
    found.forEach(row=>{const a=document.createElement("a");a.href="project.html?id="+encodeURIComponent(row.id);const b=document.createElement("b");b.textContent=row.querySelector("h2")?.textContent||row.id;const p=document.createElement("small");p.textContent=row.querySelector("p")?.textContent||"";const arrow=document.createElement("span");arrow.textContent="↗";a.append(b,p,arrow);list.append(a)});
    section.append(heading,list);const first=main.querySelector(".project-row");if(first?.parentElement)first.parentElement.before(section);else main.append(section);
   }
  }
 }catch(e){/* Storage unavailable: leave navigation fully usable. */}
 if(path==="404.html"&&main&&!main.querySelector(".folio-recovery")){
  const box=document.createElement("section");box.className="folio-recovery";box.innerHTML='<label for="folio-recovery-search">SEARCH THE SITE</label><div><input id="folio-recovery-search" type="search" placeholder="ページ名・プロジェクト名"><button type="button">検索</button></div><p aria-live="polite"></p>';main.append(box);
  const input=box.querySelector("input"),button=box.querySelector("button"),status=box.querySelector("p");
  const pages=[["HOME","index.html"],["PROJECTS","projects.html"],["BRAND","brand.html"],["NEWS","news.html"],["ABOUT","about.html"],["CONTACT","contact.html"],["FAQ","faq.html"],["JOURNAL","journal.html"],["RELEASES","releases.html"],["TECHNOLOGY","technology.html"],["TIMELINE","timeline.html"],["PARTNERSHIP","partnership.html"],["PRIVACY","privacy.html"],["SITE MAP","sitemap.html"]];
  const search=()=>{const q=input.value.trim().toLowerCase();const match=pages.find(([name,url])=>(name+" "+url).toLowerCase().includes(q));if(match)location.href=match[1];else status.textContent="該当するページが見つかりません。サイトマップをご利用ください。"};
  button.addEventListener("click",search);input.addEventListener("keydown",e=>{if(e.key==="Enter")search()});
 }
})();

/* Newsroom: one search and category filter for the update archive */
(function(){
 const root=document.querySelector(".news-page");
 if(!root)return;
 const input=root.querySelector(".news-search"),items=[...root.querySelectorAll("[data-news-item]")];
 const buttons=[...root.querySelectorAll("[data-news-filter]")],count=root.querySelector(".news-results"),empty=root.querySelector(".news-empty");
 if(!input||!items.length)return;
 let category="all";
 const apply=()=>{
  const q=input.value.trim().toLocaleLowerCase("ja");
  let visible=0;
  items.forEach(item=>{
   const matchesCategory=category==="all"||item.dataset.category===category;
   const matchesText=item.textContent.toLocaleLowerCase("ja").includes(q);
   item.hidden=!(matchesCategory&&matchesText);
   if(!item.hidden)visible++;
  });
  count.textContent=String(visible).padStart(2,"0")+" / "+String(items.length).padStart(2,"0")+" UPDATES";
  empty.hidden=visible!==0;
 };
 input.addEventListener("input",apply);
 buttons.forEach(button=>button.addEventListener("click",()=>{
  category=button.dataset.newsFilter;
  buttons.forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
  apply();
 }));
 input.addEventListener("keydown",event=>{if(event.key==="Escape"){input.value="";apply();input.blur()}});
 apply();
})();

/* Signature interactions: pointer-responsive surfaces and cinematic section reveals */
(function(){
 const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const finePointer=window.matchMedia("(hover: hover) and (pointer: fine)").matches;
 if(finePointer){
  document.querySelectorAll(".hero-art-showcase,.project-card,.corporate-link-grid a,.business-grid article,.philosophy-value-grid article").forEach(el=>{
   el.addEventListener("pointermove",event=>{
    const r=el.getBoundingClientRect(),x=((event.clientX-r.left)/r.width)*100,y=((event.clientY-r.top)/r.height)*100;
    if(el.classList.contains("hero-art-showcase")){el.style.setProperty("--pointer-x",x+"%");el.style.setProperty("--pointer-y",y+"%");el.classList.add("is-pointed")}
    else{el.style.setProperty("--spot-x",x+"%");el.style.setProperty("--spot-y",y+"%")}
   });
   el.addEventListener("pointerleave",()=>el.classList.remove("is-pointed"));
  });
 }
 if(!reduce&&"IntersectionObserver"in window){
  const targets=[...document.querySelectorAll("main > section,main .section-head,main .studio-intro-copy,main .studio-links > a")];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("folio-reveal","is-in");observer.unobserve(entry.target)}
  }),{threshold:.08,rootMargin:"0px 0px -35px 0px"});
  targets.forEach((el,i)=>{if(!el.classList.contains("hero")){el.dataset.delay=String(i%4);observer.observe(el)}});
 }
 const current=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".topbar nav a[href]").forEach(a=>{
  const href=a.getAttribute("href");
  if(href===current){a.classList.add("active");a.setAttribute("aria-current","page")}
 });
})();
