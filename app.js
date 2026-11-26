/* Fast first paint: the service worker caches versioned assets while pages stay network-first. */
if("serviceWorker" in navigator && location.protocol==="https:"){
 window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js",{scope:"./"}).catch(()=>{}),{once:true});
}
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
  setTimeout(()=>{splash.classList.add("intro-out");try{sessionStorage.setItem("folio-intro-seen","1")}catch{}setTimeout(()=>splash.remove(),260)},280);
 }
 document.addEventListener("click",e=>{
  const a=e.target.closest("a[href]");
  /* Main navigation uses native navigation to avoid transition overlays blocking page selection. */
  if(a?.closest(".topbar nav"))return;
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
  setTimeout(()=>{location.href=url.href},110);
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
 instagram:{url:null,label:"Instagram",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="ig-brand" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD776"/><stop offset=".32" stop-color="#F56040"/><stop offset=".68" stop-color="#C13584"/><stop offset="1" stop-color="#833AB4"/></linearGradient></defs><rect x="3" y="3" width="18" height="18" rx="5.4" fill="none" stroke="url(#ig-brand)" stroke-width="2.2"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="url(#ig-brand)" stroke-width="2.1"/><circle cx="18" cy="6.2" r="1.35" fill="#C13584"/></svg>'},
 x:{url:null,label:"X",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#111111" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20Z"/></svg>'},
 youtube:{url:null,label:"YouTube",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#FF0033" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z"/><path fill="#fff" d="m9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>'},
 tiktok:{url:null,label:"TikTok",svg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25F4EE" d="M14.2 1h3.1c.2 2.2 1.5 4.2 3.7 5.1v3.2a9.2 9.2 0 0 1-3.7-1.5v7.1a6.7 6.7 0 1 1-6.7-6.7c.5 0 1 .1 1.5.2v3.5a3.3 3.3 0 1 0 1.9 3V1Z" transform="translate(-1 1)"/><path fill="#FE2C55" d="M14.2 1h3.1c.2 2.2 1.5 4.2 3.7 5.1v3.2a9.2 9.2 0 0 1-3.7-1.5v7.1a6.7 6.7 0 1 1-6.7-6.7c.5 0 1 .1 1.5.2v3.5a3.3 3.3 0 1 0 1.9 3V1Z" transform="translate(1 -1)"/><path fill="#111" d="M14.2 1h3.1c.2 2.2 1.5 4.2 3.7 5.1v3.2a9.2 9.2 0 0 1-3.7-1.5v7.1a6.7 6.7 0 1 1-6.7-6.7c.5 0 1 .1 1.5.2v3.5a3.3 3.3 0 1 0 1.9 3V1Z"/></svg>'}
};
document.querySelectorAll("[data-social]").forEach(a=>{const s=SOCIALS[a.dataset.social];if(!s)return;a.innerHTML=s.svg;if(s.url){a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";a.removeAttribute("aria-disabled");a.removeAttribute("tabindex");a.title=s.label+"公式アカウントを開く";a.setAttribute("aria-label",s.label+"公式アカウントを開く")}else{a.removeAttribute("href");a.removeAttribute("target");a.removeAttribute("rel");a.setAttribute("aria-disabled","true");a.setAttribute("tabindex","-1");a.title=s.label+"公式アカウントは準備中です";a.setAttribute("aria-label",s.label+"公式アカウントは準備中です");a.classList.add("social-account-pending")}});
const header=document.querySelector(".topbar"),nav=header?.querySelector("nav"),menu=header?.querySelector(".menu");
/* One canonical navigation for every folio page. Page-specific content and app behavior remain untouched. */
if(header&&nav){
 const items=[
  ["index.html","HOME","home"],
  ["projects.html","PROJECTS","projects"],
  ["play.html","PLAY","play"],
  ["brand.html","BRAND","brand"],
  ["news.html","NEWS","news"],
  ["about.html","ABOUT","about"],
  ["contact.html","CONTACT","contact"]
 ];
 const file=(location.pathname.split("/").pop()||"index.html").toLowerCase();
 const group={
  "index.html":"home","projects.html":"projects","project.html":"projects",
  "play.html":"play","brand.html":"brand","business.html":"brand",
  "news.html":"news","about.html":"about","contact.html":"contact",
  "faq.html":"about","privacy.html":"about","policies.html":"about",
  "gallery.html":"projects","lab.html":"projects","history.html":"about",
  "status.html":"about","technology.html":"about","terminal.html":"about",
  "timeline.html":"about","philosophy.html":"brand","partnership.html":"contact",
  "journal.html":"news","releases.html":"news","versions.html":"news",
  "favorites.html":"projects","sitemap.html":"about","message.html":"contact","404.html":"",
  "code-arena.html":"play","code-lab.html":"play"
 };
 const active=group[file]||"";
 nav.setAttribute("aria-label","メインナビゲーション");
 nav.replaceChildren(...items.map(([href,label,key])=>{
  const a=document.createElement("a");a.href=href;a.textContent=label;
  if(key===active){a.classList.add("active");a.setAttribute("aria-current","page")}
  return a;
 }));
 const logo=header.querySelector(".wordmark");if(logo)logo.setAttribute("aria-label","folio ホーム");
}
/* Responsive, accessible navigation: desktop links stay visible; compact screens use the menu button. */
(function(){
 if(!header||!nav||!menu)return;
 const mobile=window.matchMedia("(max-width: 1100px)");
 nav.id="folio-main-nav";
 menu.type="button";
 menu.setAttribute("aria-controls",nav.id);
 menu.setAttribute("aria-haspopup","true");
 menu.setAttribute("aria-expanded","false");
 const setOpen=open=>{
  const isMobile=mobile.matches,visible=isMobile&&open;
  nav.classList.toggle("open",visible);
  menu.setAttribute("aria-expanded",String(visible));
  menu.textContent=visible?"×":"☰";
  menu.style.setProperty("display",isMobile?"grid":"none","important");
  menu.style.setProperty("visibility",isMobile?"visible":"hidden","important");
  menu.style.setProperty("pointer-events",isMobile?"auto":"none","important");
  nav.style.setProperty("display",isMobile?(visible?"grid":"none"):"flex","important");
  nav.style.setProperty("visibility",isMobile?(visible?"visible":"hidden"):"visible","important");
  nav.style.setProperty("opacity",isMobile?(visible?"1":"0"):"1","important");
  nav.style.setProperty("pointer-events",isMobile?(visible?"auto":"none"):"auto","important");
  nav.style.setProperty("z-index","10001","important");
  nav.setAttribute("aria-hidden",String(isMobile&&!visible));
 };
 setOpen(false);
 menu.addEventListener("click",event=>{
  event.preventDefault();event.stopPropagation();
  setOpen(menu.getAttribute("aria-expanded")!=="true");
 });
 nav.addEventListener("click",event=>{if(event.target.closest("a[href]"))setOpen(false)});
 document.addEventListener("pointerdown",event=>{if(mobile.matches&&!header.contains(event.target))setOpen(false)},true);
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&menu.getAttribute("aria-expanded")==="true"){setOpen(false);menu.focus()}});
 const onViewportChange=()=>setOpen(false);
 if(mobile.addEventListener)mobile.addEventListener("change",onViewportChange);else mobile.addListener(onViewportChange);
 window.addEventListener("resize",onViewportChange,{passive:true});
})();/* Keep folio ID entry visible in every shared site header, including mobile layouts. */
if(header){
 let account=header.querySelector(".folio-account-quick");
 if(!account){
  account=document.createElement("a");
  account.className="folio-account-quick";
  account.href="account.html";
  account.setAttribute("aria-label","folio ID ログイン");
  account.innerHTML='<img class="folio-id-icon" src="folio-id-icon.svg" alt="" width="20" height="20"><span class="folio-account-label">ログイン</span><span class="folio-account-arrow" aria-hidden="true">↗</span>';
 }
 /* Keep the account entry after the primary navigation, outside the collapsible panel. */
 if(nav&&nav.parentElement===header)header.insertBefore(account,nav.nextSibling);
 else header.insertBefore(account,header.querySelector(".theme-toggle")||menu||null);
 account.setAttribute("aria-label","folio ID ログイン");
 if(!account.querySelector(".folio-id-icon"))account.innerHTML='<img class="folio-id-icon" src="folio-id-icon.svg" alt="" width="20" height="20"><span class="folio-account-label">ログイン</span><span class="folio-account-arrow" aria-hidden="true">↗</span>';
}

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

const projectData={calendar:{name:"folio. Calendar",category:"PRODUCTIVITY / WEB APP",status:"NEW PROJECT / IN DEVELOPMENT",summary:"予定や日付をひとつの画面で整理し、毎日のスケジュールを見通しやすくするWebカレンダー。",overview:"folio. Calendarは、folio.のプロダクト群に加わるカレンダーアプリです。まずはWebブラウザで単体利用できる standalone 版として、日々の予定を分かりやすく管理できる体験を目指します。",problem:"予定を確認・整理する場所が分散すると、日々のスケジュールを把握しにくくなります。folio. Calendarでは、必要な情報を見やすくまとめ、迷わず操作できるカレンダーを目指します。",features:[["カレンダー表示","日付と予定をひと目で確認できる基本画面を設計する","開発対象"],["予定の登録・編集","予定を追加し、内容を変更・削除できる操作を整える","開発対象"],["表示の切り替え","日・週・月など、予定を確認しやすい表示方法を検討する","仕様設計"],["Web単体で利用","外部サービスに依存せず、Webアプリとして利用できる構成","v1.0.0 方針"],["外部カレンダー連携","外部カレンダーとの同期・連携を将来の拡張候補として整理する","LATER"]],flow:["カレンダーを開く","日付を選ぶ","予定を登録・確認","必要に応じて内容を編集","日々の予定を見直す"],purpose:"予定をシンプルに整理し、毎日の時間を見通しやすくすること。",scope:"開発開始時点のプロジェクトです。形態はstandalone、対応端末はWeb、外部カレンダー連携はlaterとして進めます。v1.0.0ではまず基本的なカレンダー体験の完成を目指します。",note:"NEW PROJECT / IN DEVELOPMENT。現時点では開発方針を確定した段階であり、各機能の実装状況は開発の進捗に合わせて更新します。",privacy:"個人の予定や登録内容を紹介ページに掲載しません。データの保存方法やプライバシー設計は、実装時に明確化します."},
studyplan:{name:"StudyPlan AI",category:"EDUCATION / PRODUCTIVITY",status:"IN DEVELOPMENT",summary:"学習タスク・予定・進み具合をひとつにつなぎ、今日やることを見通しやすくする学習計画ツール。",overview:"やることが複数あるとき、締切・必要時間・固定予定を別々に管理する負担を減らすためのプロジェクトです。学習タスクを整理し、実行できる計画へつなげる体験を目指しています。",problem:"課題や復習予定が散らばると、何から始めるか決めるだけで時間がかかります。StudyPlan AIでは、タスクと予定を同じ場所で見渡せる設計を考えています。",features:[["タスク登録","タイトル・教科・必要時間・期限などを記録する機能","試作で確認"],["優先順位","タスクの重要度を整理し、取り組む順番を考えやすくする","試作・改善中"],["固定予定","塾や習い事など、動かせない予定を計画条件として扱う","設計・試作"],["自動割り当て・再調整","空き時間や締切に合わせて学習計画を組み直す","開発構想"],["記録・振り返り","予定と実績を比べ、次の計画に活かす","今後の構想"],["バックアップ・印刷","データの保存・復元や、見やすい学習計画の出力","改善構想"]],flow:["タスクを登録","固定予定・計画条件を整理","優先順位を確認","計画を見ながら学習","記録を次の計画へ"],purpose:"学習に必要な情報を一か所にまとめ、計画づくりと実行の負担を減らすこと。",scope:"現在はタスク管理を中心とした試作を進めています。自動割り当て・分析などは、実装済みと混同しないよう開発構想として掲載しています。",note:"アプリの試作・設計段階です。紹介ページの機能ラベルは、実装状況と今後の構想を区別しています。",privacy:"この紹介ページに、実際の学習記録・学校名・個人の予定などは掲載していません。"},
myai:{name:"MY AI",category:"AI / PERSONAL ASSISTANT",status:"CONCEPT",summary:"必要な情報を整理し、根拠と優先順位を大切にするパーソナルAIアシスタント構想。",overview:"質問に答えるだけでなく、考えを整理し、次に取る行動を明確にするAI体験を目指す構想です。学習・制作・日常のタスクなどを横断して支援することを想定しています。",problem:"情報が多いほど、何が事実で何が推測なのか、何から手を付けるべきかが分かりにくくなります。MY AIでは、回答の分かりやすさと判断の透明性を重視します。",features:[["情報整理","相談内容やタスクをテーマごとに整理する","構想"],["根拠と推測の区別","確認できた事実と、仮説・提案を分けて示す","設計方針"],["優先順位づけ","目的・期限・重要度から次の行動を整理する","構想"],["継続的な文脈","ユーザーが許可した情報を必要な範囲で活用する","要件検討"],["プライバシー設計","保存する情報・保存先・削除方法を明確にする","要件検討"]],flow:["相談・目的を入力","情報を整理","根拠と不確実性を確認","優先順位を提示","実行結果を振り返る"],purpose:"自分で判断しやすく、行動に移しやすいパーソナルAI体験を設計すること。",scope:"現在はコンセプトと要件を整理している段階です。完成したAIアプリや実稼働サービスとしては紹介していません。",note:"CONCEPT段階。技術選定・データ管理・安全性を含めて、実現方法を検討するプロジェクトです。",privacy:"個人の会話・アカウント情報・認証情報などは紹介資料に含めません。"},
socialquiz:{name:"Social Quiz",category:"EDUCATION / WEB",status:"PROJECT",summary:"社会科の知識をクイズ形式で確認する、学習サイトのプロジェクト。",overview:"社会科の内容を、読むだけでなく問題に答えながら確認できる学習体験を目指します。短い時間でも取り組みやすい、シンプルなWebサイトとして企画しています。",problem:"用語や出来事を覚えたつもりでも、問題として問われると答えられないことがあります。クイズ形式にすることで、知識を思い出す練習につなげます。",features:[["クイズ形式","社会科の知識を問いと答えで確認する","企画内容"],["テーマ別の学習","単元・テーマごとに問題を整理する","設計項目"],["繰り返し学習","同じ内容を再確認しやすい構成を目指す","設計方針"],["結果の振り返り","解答後に理解を確認できる体験を検討する","今後の検討"]],flow:["学習テーマを選ぶ","問題に挑戦","答えを確認","苦手な内容をもう一度確認"],purpose:"社会科の知識を問題形式で確認し、繰り返し学習しやすくすること。",scope:"社会科クイズサイトとして企画・制作しています。問題数や成績保存など、確認できていない機能は確定事項として掲載していません。",note:"PROJECT段階。実際の公開範囲・問題データ・機能は、確認後に更新します。",privacy:"学習者の氏名・学校・成績などの個人情報を掲載しない方針です。"},
qrpay:{name:"QR PAY",category:"UI / DIGITAL EXPERIENCE",status:"IN DEVELOPMENT",summary:"QRコードを使った支払いの流れを題材に、利用者と店舗の画面体験を設計するUIプロジェクト。",overview:"支払う人と店舗スタッフの双方が、迷わず操作できる画面の流れを考えるプロジェクトです。決済そのものを提供するのではなく、画面設計・操作性・情報の見せ方を試作しています。",problem:"支払い画面では、金額・店舗・操作の次の手順が分かりにくいと不安につながります。QR PAYでは、利用者側と店舗側の視点を分けて設計します。",features:[["利用者向け画面","支払いの流れを利用者目線で整理する","UI試作"],["店舗向け画面","店舗側で確認する情報や操作を整理する","UI試作"],["セルフレジ体験","セルフ操作を想定した画面遷移を検討する","構想・試作"],["操作フロー","読み取りから完了表示までの情報設計を考える","設計中"]],flow:["利用者・店舗の役割を選ぶ","画面で必要情報を確認","操作ステップを進める","完了状態を確認"],purpose:"利用者と店舗の双方にとって、分かりやすく安心感のある決済UIを設計すること。",scope:"利用者向け・店舗向けの画面や操作フローを検討・制作しています。実際の決済ネットワークや資金移動の機能はありません。",note:"UI・コンセプトのプロジェクトです。実際の支払い、カード情報や口座情報の入力には対応していません。",privacy:"実際の決済情報・カード番号・口座情報・利用者データを収集するサービスではありません。"},
seatlabo:{name:"Seat Labo",category:"WEB / UTILITY",status:"PROJECT",summary:"座席配置や席替えを分かりやすく扱うためのWebツール構想。",overview:"座席の配置を見やすく整理し、席替えや座席管理の手間を減らすことを目指すプロジェクトです。実際の利用場面を想定しながら、画面構成と操作の分かりやすさを検討しています。",problem:"座席表の作成や変更を手作業で行うと、配置の確認や修正に手間がかかります。Seat Laboでは、座席を視覚的に扱える体験を考えています。",features:[["座席レイアウト","座席を一覧で見渡せる画面を検討する","設計項目"],["配置の変更","座席の入れ替え・調整を行う操作を検討する","構想"],["管理しやすさ","利用場面に合わせたシンプルな操作を設計する","設計方針"],["表示の最適化","スマートフォン・タブレット・PCでの見やすさを考える","設計方針"]],flow:["座席の条件を整理","座席表を表示","配置を調整","結果を確認"],purpose:"座席の配置や管理を、視覚的で分かりやすい操作にすること。",scope:"現在は機能設計・画面構成を中心に整理しています。抽選方式や保存機能など、詳細仕様が未確定の内容は今後の検討事項です。",note:"PROJECT段階。確定していない機能や実装状況は、公開資料で断定しません。",privacy:"実在する利用者名・クラス情報・座席名簿などは公開ページに掲載しません。"},
reception:{name:"Home Reception",category:"WEB / SYSTEM",status:"IN DEVELOPMENT",summary:"来客受付の流れをデジタル化し、受付側と管理側の確認をスムーズにするWebシステム。",overview:"来客者が入力する受付画面と、管理者が内容を確認する画面を分け、受付の流れをシンプルにすることを目指しています。複数の端末で使う場面も想定した設計です。",problem:"受付時に必要な情報や確認手順が分散すると、来客者にも管理者にも負担がかかります。Home Receptionでは、入力から確認までの流れを整理します。",features:[["来客者向け受付フォーム","必要な項目を分かりやすく入力できる画面を設計する","開発対象"],["管理者向け一覧","受付内容を管理側で確認する画面を設計する","開発対象"],["端末別レイアウト","スマートフォン・タブレット・PCでの表示を調整する","設計・改善"],["受付フロー","入力後に次に何をすればよいかを明確にする","設計方針"]],flow:["受付画面を開く","必要事項を入力","受付内容を確認","管理者側で確認"],purpose:"来客者の受付と管理者による確認を、分かりやすい一連の流れにすること。",scope:"受付フォーム・管理者向け一覧・端末ごとの表示などを開発対象としています。実際の運用やデータ保存の安全性は、公開前に別途検証が必要です。",note:"IN DEVELOPMENT。実際の来客者情報を公開デモや紹介ページに載せないよう配慮しています。",privacy:"このサイトの紹介資料には、実際の訪問者名・住所・訪問日時・連絡先などを含めません。"},
"nine-subjects":{name:"9科テスト対策",category:"EDUCATION / EXAM PREPARATION",status:"STUDY PROJECT",summary:"9教科から好きな科目を選び、クイズ形式で学習できるテスト対策サイト。",overview:"主要5教科に加えて、実技教科も含む9科目を対象に、教科を選んで問題に挑戦できる学習サイトです。必要な教科へすぐ移動できる分かりやすい構成を目指しています。",problem:"複数教科を勉強するとき、教材や確認方法が分かれていると切り替えに手間がかかります。9科テスト対策では、教科選択からクイズまでを一つのサイトにまとめます。",features:[["9教科を選択","国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭","企画内容"],["クイズに挑戦","選択した教科の問題に取り組む","サイトの中心機能"],["教科を切り替え","学習したい科目へ移動しやすい構成","設計方針"],["学習の振り返り","解答後に理解を確認する体験を検討する","今後の改善"]],flow:["教科を選ぶ","クイズを開始","問題に回答","解説・答えを確認","別の教科へ進む"],purpose:"9教科の学習内容をクイズ形式で確認し、好きな教科から取り組めるようにすること。",scope:"9科目のクイズ学習サイトです。学習計画や成績管理を行うStudyPlan AIとは役割を分けています。",note:"学習プロジェクト。問題データや各教科の収録状況は、確認できた範囲に合わせて紹介します。",privacy:"学校名・学級・個人の成績などを紹介ページに掲載しません。",subjects:["国語","数学","英語","理科","社会","音楽","美術","保健体育","技術家庭"]}
};
dayline:{name:"DAY LINE",category:"DAILY INFORMATION / WEB DASHBOARD",status:"PROJECT / IN DEVELOPMENT",summary:"時刻を中心に、天気・ニュース・カレンダー・防災情報をひとつの画面にまとめるデイリーダッシュボード。",overview:"DAY LINEは、毎日確認したい情報をひとつの画面に整理するダッシュボードです。現在時刻を見やすく表示しながら、天気・ニュース・カレンダー・防災情報などをまとめて確認できる体験を目指しています。",problem:"時刻、天気、ニュースなどを別々のアプリやページで確認すると、必要な情報を探す手間が増えます。DAY LINEでは、日々の情報をひとつの場所に集約し、短い時間で全体を把握できる構成を重視します。",features:[["時計・日付表示","現在時刻を中心に、日付や曜日を確認できる画面","主要機能"],["天気情報","日々の天気を確認するための情報エリア","情報表示"],["ニュース","最新の話題をまとめて確認できるニュースエリア","情報表示"],["カレンダー","日付や予定を把握するためのカレンダー表示","情報表示"],["防災情報","必要な防災・注意情報を確認するための表示領域","情報表示"],["端末別レイアウト","PC・タブレット・スマートフォンで見やすい画面構成","継続改善"]],flow:["DAY LINEを開く","時刻・日付を確認","天気やニュースを確認","カレンダー・防災情報を確認","必要な情報をまとめて把握"],purpose:"毎日確認したい情報を、見やすく落ち着いた画面でひとつにまとめること。",scope:"DAY LINEは独立したWebプロジェクトです。各情報の取得元や更新タイミングは情報ごとに異なるため、すべてがリアルタイム更新されるとは限りません。",note:"プロジェクト紹介では、画面上で確認できる機能を中心に掲載しています。情報提供元・更新時刻・利用環境によって表示内容が変わる場合があります。",privacy:"この紹介ページには、個人の位置情報・閲覧履歴・個人アカウント情報を掲載しません。"},
 const detailPolicyStyle=document.createElement("style");detailPolicyStyle.textContent=".detail-policy-link{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 14px;border:1px solid var(--line,#ddd);border-radius:999px;color:inherit;text-decoration:none;font-size:12px;transition:background .2s,border-color .2s}.detail-policy-link:hover{background:rgba(120,120,120,.08);border-color:currentColor}@media(max-width:600px){.detail-policy-link{width:100%}}";document.head.append(detailPolicyStyle);
const detailRoot=document.querySelector("#project-detail");
if(detailRoot){
 const id=new URLSearchParams(location.search).get("id"),d=projectData[id];
 if(!d){detailRoot.innerHTML='<div class="eyebrow"><i></i> PROJECT NOT FOUND</div><h1 class="page-title">Project not found.</h1><p class="lead">指定されたプロジェクトが見つかりませんでした。</p><a class="text-link" href="projects.html">← プロジェクト一覧へ戻る</a>'}
 else{
 document.title=d.name+" — folio";
 const esc=value=>String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const subjects=d.subjects?'<div class="detail-subjects">'+d.subjects.map(x=>'<span>'+esc(x)+'</span>').join("")+'</div>':"";
 const policyAnchor=({calendar:"calendar",studyplan:"studyplan",myai:"myai",socialquiz:"socialquiz",qrpay:"qrpay",seatlabo:"seatlabo",reception:"reception","nine-subjects":"nine-subjects"})[id]||"privacy";
 const features=d.features.map((x,i)=>'<article class="detail-feature"><span class="detail-feature-no">0'+(i+1)+'</span><div><h3>'+esc(x[0])+'</h3><p>'+esc(x[1])+'</p></div><small>'+esc(x[2])+'</small></article>').join("");
 const flow=d.flow.map((x,i)=>'<li><span>0'+(i+1)+'</span><b>'+esc(x)+'</b></li>').join("");
 const toc=[["overview","概要"],["challenge","背景・課題"],["features","機能・設計"],["flow","利用イメージ"],["privacy","プライバシー"]];
 detailRoot.innerHTML='<div class="detail-hero"><div class="eyebrow"><i></i> PROJECT / '+esc(d.category)+'</div><a class="back-link" href="projects.html">← ALL PROJECTS</a><p class="detail-index">FOLIO PROJECT FILE / '+id.toUpperCase()+'</p><h1 class="page-title detail-title">'+esc(d.name)+'<span>.</span></h1><div class="detail-meta"><span class="status">'+esc(d.status)+'</span><span class="detail-id">PROJECT BRIEF / 2026</span></div><p class="detail-summary">'+esc(d.summary)+'</p><div class="detail-hero-actions"><a href="#features" class="detail-primary">プロジェクトの中身を見る ↓</a><button type="button" class="detail-print" onclick="window.print()">資料として印刷・PDF保存 ↗</button><a class="detail-policy-link" href="policy.html#'+policyAnchor+'">利用ポリシーを確認 ↗</a></div></div><nav class="detail-toc" aria-label="このページの目次">'+toc.map((x,i)=>'<a href="#'+x[0]+'"><span>0'+(i+1)+'</span>'+x[1]+'</a>').join("")+'</nav><section id="overview" class="detail-document"><div class="detail-section-heading"><span>01 / OVERVIEW</span><h2>このプロジェクトについて</h2></div><p class="detail-prose">'+esc(d.overview)+'</p><div class="detail-purpose"><span>THE PURPOSE</span><p>'+esc(d.purpose)+'</p></div></section><section id="challenge" class="detail-document"><div class="detail-section-heading"><span>02 / THE CHALLENGE</span><h2>なぜ作るのか</h2></div><p class="detail-prose">'+esc(d.problem)+'</p></section><section id="features" class="detail-document"><div class="detail-section-heading"><span>03 / FEATURES & DESIGN</span><h2>機能・設計ポイント</h2></div><div class="detail-feature-list">'+features+'</div>'+subjects+'</section><section id="flow" class="detail-document"><div class="detail-section-heading"><span>04 / USER JOURNEY</span><h2>利用イメージ</h2></div><ol class="detail-flow">'+flow+'</ol></section><section id="privacy" class="detail-document detail-privacy"><div class="detail-section-heading"><span>05 / PRIVACY & STATUS</span><h2>プライバシーと開発状況</h2></div><p class="detail-prose">'+esc(d.privacy)+'</p><p class="detail-prose">'+esc(d.note)+'</p><p class="detail-disclaimer">このページでは、確認できた内容と今後の構想を区別しています。未確認の機能を完成済みとして紹介しません。</p></section><section class="detail-related"><div><span>EXPLORE MORE</span><h2>ほかのプロジェクトも見る。</h2></div><a href="projects.html">PROJECT INDEX ↗</a></section>';
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



/* Unified search entry: opens the command palette instead of creating a second search system. */
(function(){
 const header=document.querySelector(".topbar");
 if(header&&!header.querySelector(".global-search-trigger")){
  const trigger=document.createElement("button");
  trigger.type="button";
  trigger.className="global-search-trigger";
  trigger.setAttribute("aria-label","サイト内検索・ページ移動");
  trigger.title="サイト内検索";
  trigger.innerHTML='<span aria-hidden="true">⌕</span>';
  trigger.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("folio:open-command")));
  header.insertBefore(trigger,header.querySelector(".menu")||null);
 }
 document.querySelectorAll(".footer").forEach(footer=>{
  if(footer.querySelector(".footer-utility-links"))return;
  const links=document.createElement("div");links.className="footer-utility-links";
  [["FAQ","faq.html"],["SITE MAP","sitemap.html"]].forEach(([label,url])=>{const a=document.createElement("a");a.href=url;a.textContent=label;links.append(a)});
  footer.append(links);
 });
})();

/* Lightweight visitor tools: favorites, recently viewed, font sizing, FAQ search */
(function(){
 const KEY_FAV="folio-favorites-v1",KEY_RECENT="folio-recent-v1";
 const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}};
 const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
 const ids=["studyplan","myai","socialquiz","qrpay","seatlabo","reception","nine-subjects","calendar"];
 const names={studyplan:"StudyPlan AI",myai:"MY AI",socialquiz:"Social Quiz",qrpay:"QR PAY",seatlabo:"Seat Labo",reception:"Home Reception","nine-subjects":"9科テスト対策",calendar:"folio. Calendar"};
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



/* Homepage discovery: rotate a featured project without leaving the page. */
(function(){
 const link=document.querySelector("[data-discover-project]"),button=document.querySelector("[data-discover-refresh]"),caption=document.querySelector("[data-discover-caption]");
 if(!link||!button)return;
 const picks=[
  ["studyplan","StudyPlan AI","学習の計画を、もっと使いやすく。"],
  ["myai","MY AI","自分の基準で考えるAIの構想。"],
  ["qrpay","QR PAY","支払い体験をデザインする。"],
  ["nine-subjects","9科テスト対策","9教科から、今日の学びを選ぼう。"],
  ["seatlabo","Seat Labo","座席管理を、もっと直感的に。"],
  ["reception","Home Reception","受付の流れを、すっきりシンプルに。"],
  ["socialquiz","Social Quiz","クイズで知識を確かめよう。"]
 ];
 let last=-1;
 const choose=()=>{
  let n=Math.floor(Math.random()*picks.length);
  if(picks.length>1&&n===last)n=(n+1)%picks.length;
  last=n;
  const [id,name,description]=picks[n];
  link.href="project.html?id="+encodeURIComponent(id);
  link.querySelector("h3").textContent=name;
  if(caption)caption.textContent=description;
  button.animate?.([{transform:"rotate(0deg)"},{transform:"rotate(180deg)"}],{duration:360,easing:"cubic-bezier(.2,.8,.2,1)"});
 };
 choose();
 button.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();choose()});
})();




