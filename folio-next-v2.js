/* folio. NEXT — additive features; existing site content is never replaced. */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const safe=(k,def)=>{try{return JSON.parse(localStorage.getItem(k))??def}catch{return def}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const projects=$$(".project-row").map(row=>({id:row.id,name:$("h2",row)?.textContent||row.id,desc:$("p",row)?.textContent||"",status:$(".status",row)?.textContent||"STATUS UNKNOWN",url:"project.html?id="+encodeURIComponent(row.id),row}));
const allCards=$$(".project-card");
const currentFile=location.pathname.split("/").pop()||"index.html";
const style=document.createElement("link");style.rel="stylesheet";style.href="folio-next.css?v=20261125-19";document.head.append(style);
const root=document.createElement("div");root.id="folio-next-root";document.body.append(root);
const overlay=(name,html)=>{const el=document.createElement("section");el.className="fn-overlay";el.hidden=true;el.setAttribute("aria-label",name);el.innerHTML='<div class="fn-panel" role="dialog" aria-modal="true" aria-label="'+name+'"><button class="fn-close" type="button" aria-label="閉じる">×</button>'+html+'</div>';root.append(el);const close=()=>{el.hidden=true};$(".fn-close",el).addEventListener("click",close);el.addEventListener("click",e=>{if(e.target===el)close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});return {el,close};};
const toast=(msg)=>{let t=$(".fn-toast",root);if(!t){t=document.createElement("div");t.className="fn-toast";t.setAttribute("role","status");root.append(t)}t.textContent=msg;t.classList.add("show");clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove("show"),2200)};
const button=(label,action,cls="")=>{const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",action);return b};
const toolrow=document.createElement("div");toolrow.className="fn-quick-tools";toolrow.innerHTML='<button type="button" data-fn="share" aria-label="このページを共有" title="このページを共有">↗</button>';root.append(toolrow);
/* Global search — unified pages, projects, features and actions */
const command=overlay("サイト全体検索",'<p class="fn-kicker">FOLIO / SEARCH</p><div class="fn-command-heading"><h2>何をお探しですか？</h2><span class="fn-command-shortcut">ESC</span></div><label class="fn-command-search"><span aria-hidden="true">⌕</span><input class="fn-command-input" type="search" placeholder="プロジェクト・ページ・機能を検索..." aria-label="サイト全体を検索" autocomplete="off"><button class="fn-search-clear" type="button" aria-label="検索をクリア">×</button></label><div class="fn-command-tabs" role="group" aria-label="検索カテゴリー"><button type="button" data-command-filter="all" aria-pressed="true">すべて</button><button type="button" data-command-filter="project" aria-pressed="false">プロジェクト</button><button type="button" data-command-filter="page" aria-pressed="false">ページ</button><button type="button" data-command-filter="feature" aria-pressed="false">機能</button></div><div class="fn-search-recent" aria-label="最近の検索"></div><div class="fn-command-meta"><span class="fn-command-count" aria-live="polite"></span><span>↑ ↓ 移動　↵ 開く</span></div><div class="fn-command-results" role="listbox" aria-label="検索結果"></div><p class="fn-hint">⌘ K / Ctrl K で開く · Esc で閉じる</p>');
const commandInput=$(".fn-command-input",command.el),commandResults=$(".fn-command-results",command.el),commandCount=$(".fn-command-count",command.el),commandRecent=$(".fn-search-recent",command.el);
const commandTabs=$$(".fn-command-tabs button",command.el);
const projectCatalog=[
 {id:"studyplan",name:"StudyPlan AI",desc:"学習タスク・予定・学習計画を整理するアプリ",keywords:"勉強 学習 スケジュール タスク 計画 studyplan",url:"project.html?id=studyplan"},
 {id:"myai",name:"MY AI",desc:"自分の判断基準を大切にするパーソナルAI構想",keywords:"人工知能 AI assistant アシスタント",url:"project.html?id=myai"},
 {id:"socialquiz",name:"Social Quiz",desc:"社会科の知識をクイズ形式で確認する学習サイト",keywords:"社会 歴史 地理 公民 クイズ",url:"project.html?id=socialquiz"},
 {id:"qrpay",name:"QR PAY",desc:"QRコードを使った決済体験のUI・機能開発",keywords:"決済 支払い QR payment",url:"project.html?id=qrpay"},
 {id:"seatlabo",name:"Seat Labo",desc:"席替え・座席管理を支援するツール",keywords:"席替え 座席 クラス 管理",url:"project.html?id=seatlabo"},
 {id:"reception",name:"Home Reception",desc:"来客受付をデジタル化するサイト",keywords:"受付 来客 reception",url:"project.html?id=reception"},
 {id:"nine-subjects",name:"9科テスト対策",desc:"9教科のクイズで学習できるサイト",keywords:"テスト 勉強 教科 9科目",url:"project.html?id=nine-subjects"},
 {id:"calendar",name:"folio. Calendar",desc:"予定や日付を整理するWebカレンダー",keywords:"カレンダー 予定 スケジュール calendar productivity",url:"project.html?id=calendar"}
];
const pageList=[
 ["HOME","ホーム","index.html","トップ メイン"],["PROJECTS","プロジェクト一覧","projects.html","制作 作品 開発"],["PLAY","folio.のゲーム","play.html","ゲーム 遊ぶ クイズ"],["BRAND","ブランドについて","brand.html","ブランド"],["NEWS","ニュース・更新情報","news.html","お知らせ"],["ABOUT","folio.について","about.html","概要"],["CONTACT","お問い合わせ","contact.html","連絡"],["PHILOSOPHY","理念","philosophy.html","ミッション ビジョン"],["BUSINESS","事業紹介","business.html","事業"],["MESSAGE","スタジオメッセージ","message.html","メッセージ"],["JOURNAL","ジャーナル","journal.html","記事 開発記録"],["RELEASES","リリース情報","releases.html","更新"],["TECHNOLOGY","テクノロジー","technology.html","技術"],["TIMELINE","沿革","timeline.html","年表 歴史"],["PARTNERSHIP","パートナーシップ","partnership.html","協業"],["FAQ","よくある質問","faq.html","ヘルプ"],["PRIVACY","プライバシー","privacy.html","個人情報"],["SITE MAP","サイトマップ","sitemap.html","一覧"],["folio. LAB","デザイン・実験室","lab.html","実験 デザイン"],["folio. Terminal","ターミナル","terminal.html","コマンド"],["SYSTEM STATUS","開発ステータス","status.html","状態"],["VERSION HISTORY","更新履歴","versions.html","バージョン"],["PROJECT GALLERY","ビジュアルギャラリー","gallery.html","画像 ビジュアル"],["FAVORITES","お気に入り","favorites.html","保存"],["RECENT HISTORY","閲覧履歴","history.html","最近 見た ページ"]
].map(([name,desc,url,keywords])=>({name,desc,url,type:"page",keywords}));
const featureList=[
 {name:"サイト全体検索",desc:"ページ・プロジェクト・機能をまとめて検索",url:"#",type:"feature",keywords:"検索 search command palette"},
 {name:"お気に入り",desc:"保存したプロジェクトやページを確認",url:"favorites.html",type:"feature",keywords:"保存 favorite"},
 {name:"閲覧履歴",desc:"最近開いたページを確認",url:"history.html",type:"feature",keywords:"履歴 recent"},
 {name:"共有センター",desc:"ページURLのコピー・共有・QR表示",url:"#",type:"feature",keywords:"share url qr コピー"},
 {name:"folio. PLAY",desc:"クイズ・プロジェクト当て・記憶ゲーム",url:"play.html",type:"feature",keywords:"遊ぶ ゲーム quiz"},
 {name:"folio. LAB",desc:"UIやモーションの実験",url:"lab.html",type:"feature",keywords:"実験 design motion"},
 {name:"folio. Terminal",desc:"folio.の情報をコマンド形式で探索",url:"terminal.html",type:"feature",keywords:"terminal command"}
];
const quickActions=[
 {name:"ページの先頭へ戻る",desc:"現在のページを一番上までスクロール",type:"action",keywords:"top scroll",run:()=>{window.scrollTo({top:0,behavior:"smooth"});command.close()}},
 {name:"このページを共有",desc:"共有メニューを開く",type:"action",keywords:"share url copy",run:()=>{command.close();share.el.hidden=false}},
 {name:"プロジェクトをランダムに見る",desc:"プロジェクトをひとつ選んで開く",type:"action",keywords:"random discover おすすめ",run:()=>{const list=projectCatalog;if(list.length)location.href=list[Math.floor(Math.random()*list.length)].url;else location.href="projects.html"}},
 {name:"お気に入りを開く",desc:"保存したプロジェクトを見る",type:"action",keywords:"favorite saved",run:()=>location.href="favorites.html"},
 {name:"閲覧履歴を開く",desc:"最近見たページを確認",type:"action",keywords:"history recent",run:()=>location.href="history.html"}
];
let commandFilter="all",commandActive=0,commandItems=[];
const searchHistoryKey="folio-search-history-v1";
const normalizeCommand=s=>String(s||"").toLocaleLowerCase("ja").normalize("NFKC").replace(/[・._-]/g," ").replace(/\s+/g," ").trim();
function commandDataset(){const catalog=projectCatalog.map(item=>{const live=projects.find(p=>p.id===item.id);return {...item,desc:live?.desc||item.desc,type:"project",keywords:(item.keywords||"")+" "+(live?.status||"")}});return [...pageList,...catalog,...featureList,...quickActions]}
function rememberSearch(q){const term=String(q||"").trim();if(term.length<2)return;const old=safe(searchHistoryKey,[]);save(searchHistoryKey,[term,...old.filter(x=>x!==term)].slice(0,5))}
function renderRecent(){commandRecent.replaceChildren();const recent=safe(searchHistoryKey,[]);if(!recent.length){commandRecent.hidden=true;return}commandRecent.hidden=false;const label=document.createElement("span");label.className="fn-search-recent-label";label.textContent="最近の検索";commandRecent.append(label);recent.forEach(term=>{const b=button(term,()=>{commandInput.value=term;drawCommands(term);commandInput.focus()},"fn-search-chip");commandRecent.append(b)})}
function drawCommands(q=""){
 const tokens=normalizeCommand(q).split(/\s+/).filter(Boolean);
 commandItems=commandDataset().map(item=>{const hay=normalizeCommand([item.name,item.desc,item.keywords,item.type].join(" "));const score=tokens.reduce((n,t)=>n+(hay.includes(t)?1:0),0);return {...item,_score:score}}).filter(item=>(commandFilter==="all"||(commandFilter==="action"?item.type==="action":item.type===commandFilter))&&(!tokens.length||item._score===tokens.length)).sort((a,b)=>b._score-a._score||a.name.localeCompare(b.name,"ja")).slice(0,40);
 commandActive=0;commandResults.replaceChildren();commandCount.textContent=commandItems.length+" 件";
 commandItems.forEach((item,index)=>{
  const el=document.createElement(item.run?"button":"a");if(item.run)el.type="button";else if(item.url!=="#")el.href=item.url;else{el.href="#";el.addEventListener("click",e=>{e.preventDefault();if(item.name==="サイト全体検索"){commandInput.focus()}else if(item.name==="共有センター"){command.close();share.el.hidden=false}})}
  el.className="fn-command-item"+(index===0?" is-active":"");el.setAttribute("role","option");el.setAttribute("aria-selected",String(index===0));
  const copy=document.createElement("span");copy.className="fn-command-copy";const title=document.createElement("b");title.textContent=item.name;const desc=document.createElement("small");desc.textContent=item.desc||"";copy.append(title,desc);
  const tag=document.createElement("span");tag.className="fn-command-type";tag.textContent=item.type==="page"?"ページ":item.type==="project"?"PROJECT":item.type==="feature"?"機能":"操作";
  const arrow=document.createElement("span");arrow.className="fn-command-arrow";arrow.textContent=item.run||item.url==="#"?"↗":"→";el.append(copy,tag,arrow);
  if(item.run)el.addEventListener("click",item.run);
  el.addEventListener("click",()=>rememberSearch(commandInput.value));el.addEventListener("mouseenter",()=>setCommandActive(index));commandResults.append(el);
 });
 if(!commandItems.length){const empty=document.createElement("div");empty.className="fn-command-empty";const title=document.createElement("b");title.textContent="見つかりませんでした";const hint=document.createElement("p");hint.textContent="別の言い方や短いキーワードで検索してみてください。";const reset=button("検索条件をクリア",()=>{commandInput.value="";drawCommands();commandInput.focus()},"fn-search-reset");empty.append(title,hint,reset);commandResults.append(empty)}
}
function setCommandActive(index){commandActive=Math.max(0,Math.min(index,commandItems.length-1));$$(".fn-command-item",commandResults).forEach((el,i)=>{el.classList.toggle("is-active",i===commandActive);el.setAttribute("aria-selected",String(i===commandActive))});$(".fn-command-item.is-active",commandResults)?.scrollIntoView({block:"nearest"})}
commandTabs.forEach(tab=>tab.addEventListener("click",()=>{commandFilter=tab.dataset.commandFilter;commandTabs.forEach(t=>t.setAttribute("aria-pressed",String(t===tab)));drawCommands(commandInput.value)}));
commandInput.addEventListener("input",()=>{drawCommands(commandInput.value);commandRecent.hidden=!!commandInput.value.trim()});
$(".fn-search-clear",command.el).addEventListener("click",()=>{commandInput.value="";drawCommands();commandInput.focus();commandRecent.hidden=false});
commandInput.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();setCommandActive(commandActive+1)}else if(e.key==="ArrowUp"){e.preventDefault();setCommandActive(commandActive-1)}else if(e.key==="Enter"){e.preventDefault();const item=commandItems[commandActive];if(!item)return;rememberSearch(commandInput.value);if(item.run)item.run();else if(item.url&&item.url!=="#")location.href=item.url;else if(item.name==="共有センター"){command.close();share.el.hidden=false}}});
function openCommand(){command.el.hidden=false;commandFilter="all";commandTabs.forEach(t=>t.setAttribute("aria-pressed",String(t.dataset.commandFilter==="all")));commandInput.value="";drawCommands();renderRecent();requestAnimationFrame(()=>commandInput.focus())}
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommand()}});

document.addEventListener("folio:open-command",openCommand);
/* Persistent global-search entry point in the shared header */
(function(){
 const header=document.querySelector(".topbar");
 if(!header||header.querySelector(".global-search-trigger"))return;
 const trigger=document.createElement("button");
 trigger.type="button";trigger.className="global-search-trigger";
 trigger.setAttribute("aria-label","サイト全体を検索");trigger.title="サイト全体を検索";
 trigger.textContent="⌕";trigger.addEventListener("click",openCommand);
 const menu=header.querySelector(".menu");
 header.insertBefore(trigger,menu||null);
})();
/* share center */
const share=overlay("共有センター",'<p class="fn-kicker">FOLIO / SHARE</p><h2>Share this page.</h2><p class="fn-muted">このページを共有できます。</p><div class="fn-share-actions"></div><div class="fn-qr-wrap" hidden></div>');
const shareActions=$(".fn-share-actions",share.el);
shareActions.append(button("URLをコピー",async()=>{try{await navigator.clipboard.writeText(location.href);toast("URLをコピーしました")}catch{const i=document.createElement("input");i.value=location.href;share.el.append(i);i.select();try{document.execCommand("copy");toast("URLをコピーしました")}catch{toast("コピーできませんでした")}i.remove()}}));
shareActions.append(button("端末の共有機能を使う",async()=>{if(navigator.share){try{await navigator.share({title:document.title,url:location.href})}catch(e){if(e.name!=="AbortError")toast("共有できませんでした")}}else toast("この端末では共有機能を利用できません")}));
shareActions.append(button("QRコードを表示",()=>{const q=$(".fn-qr-wrap",share.el);q.hidden=!q.hidden;if(!q.hidden){const url="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data="+encodeURIComponent(location.href);q.innerHTML='<img alt="このページのQRコード" width="180" height="180">';$("img",q).src=url}}));
$$("[data-fn=share]",root).forEach(b=>b.addEventListener("click",()=>share.el.hidden=false));
/* favourites and recent history */
const histKey="folio-page-history-v1";
let hist=safe(histKey,[]);hist=[{url:location.pathname+location.search,name:document.title.replace(/\\s*[—|｜-]\\s*folio.*$/i,"").trim()||currentFile,date:Date.now()},...hist.filter(x=>x.url!==location.pathname+location.search)].slice(0,30);save(histKey,hist);
/* Favorites are managed by the canonical site-wide library in app.js. */
const favKey="folio-favorites-v1";
const projectNames={studyplan:"StudyPlan AI",myai:"MY AI",socialquiz:"Social Quiz",qrpay:"QR PAY",seatlabo:"Seat Labo",reception:"Home Reception","nine-subjects":"9科テスト対策",calendar:"folio. Calendar"};
/* stage labels derived from existing project status, never invented progress percentages */
const stageFor=s=>/LIVE|PUBLISHED|公開/i.test(s)?"公開":/DEVELOP|IN DEVELOPMENT/i.test(s)?"開発中":/TEST/i.test(s)?"テスト":/CONCEPT|IDEA/i.test(s)?"構想": "プロジェクト";
projects.forEach(p=>{const tag=document.createElement("span");tag.className="fn-stage";tag.textContent="STAGE / "+stageFor(p.status);const status=$(".status",p.row);if(status)status.insertAdjacentElement("afterend",tag)});
/* gallery from existing project artwork */
function buildGallery(){const items=projects.length?projects:allCards.map(c=>({name:$("h3",c)?.textContent||"Project",desc:$("p",c)?.textContent||"",url:c.href,row:c}));const grid=document.createElement("div");grid.className="fn-gallery-grid";items.forEach(p=>{const card=document.createElement("a");card.className="fn-gallery-card";card.href=p.url;const art=$(".row-mark svg,.card-art svg",p.row||document);if(art)card.append(art.cloneNode(true));const h=document.createElement("b");h.textContent=p.name;const d=document.createElement("p");d.textContent=p.desc;card.append(h,d);grid.append(card)});return grid}
/* system status is an honest, manually described snapshot based on project labels */
function statusContent(){const box=document.createElement("div");box.className="fn-status-list";projects.forEach(p=>{const row=document.createElement("div");row.className="fn-status-row";const n=document.createElement("b");n.textContent=p.name;const s=document.createElement("span");s.textContent=stageFor(p.status);row.append(n,s);box.append(row)});if(!projects.length)box.textContent="プロジェクト情報はPROJECTSページで確認できます。";return box}
/* Remove the static placeholder hero on feature pages; the full feature view below is the single source of truth. */
if(["lab.html","terminal.html","gallery.html","status.html","versions.html","favorites.html","history.html"].includes(currentFile)){const featureMain=$("main");if(featureMain)featureMain.replaceChildren()}
/* signature pointer lighting: subtle, local and disabled on touch/reduced-motion devices */
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.matchMedia("(hover: hover)").matches){
 document.addEventListener("pointermove",e=>{
  const card=e.target.closest(".project-card,.fn-gallery-card,.fn-lab-grid article,.detail-panel");
  if(!card)return;
  const r=card.getBoundingClientRect();
  card.style.setProperty("--spot-x",((e.clientX-r.left)/r.width*100)+"%");
  card.style.setProperty("--spot-y",((e.clientY-r.top)/r.height*100)+"%");
 },{passive:true});
}
/* route new feature pages; they are additive and keep existing pages untouched */
if(currentFile==="lab.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / EXPERIMENTS</p><h1>folio. <em>LAB.</em></h1><p>アイデアを試し、体験を磨く。操作できる小さなUI実験を公開しています。</p><div class="fn-lab-grid"><article><b>01 / MOTION STUDY</b><h2>Motion playground.</h2><p>ボタンで動きの違いを試せます。</p><div class="fn-motion-demo"><div class="fn-motion-orb"></div></div><button type="button" class="fn-lab-trigger">PLAY MOTION ↗</button><span>INTERACTION / LIVE DEMO</span></article><article><b>02 / PRODUCT IDEAS</b><h2>Ideas in progress.</h2><p>プロダクトの構想・改善案を整理するスペースです。</p><a href="projects.html">PROJECTSを見る ↗</a><span>CONCEPT / ONGOING</span></article><article><b>03 / UI PLAYGROUND</b><h2>Interface playground.</h2><p>画面構成やコンポーネントの検討を行います。</p><button type="button" class="fn-lab-theme">SURFACE / SWITCH</button><span>DESIGN / EXPERIMENTAL</span></article></div>';main.append(section);const play=$(".fn-lab-trigger",section),orb=$(".fn-motion-orb",section);play.addEventListener("click",()=>{orb.classList.remove("is-moving");void orb.offsetWidth;orb.classList.add("is-moving")});const surface=$(".fn-lab-theme",section);surface.addEventListener("click",()=>{const card=surface.closest("article");card.classList.toggle("is-alternate");surface.textContent=card.classList.contains("is-alternate")?"RESET SURFACE ↗":"SURFACE / SWITCH"})}
if(currentFile==="terminal.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / TERMINAL</p><h1>folio. <em>Terminal.</em></h1><p>folio.の情報をコマンド形式で探索できます。システムや端末のコマンドは実行しません。</p><div class="fn-terminal"><div class="fn-terminal-bar"><i></i><i></i><i></i><span>FOLIO TERMINAL</span></div><div class="fn-terminal-output" aria-live="polite">Welcome to folio. terminal.<br>help と入力すると利用可能なコマンドを表示します。</div><form class="fn-terminal-form"><label>visitor@folio:~$ <input autocomplete="off" spellcheck="false" aria-label="コマンド入力" placeholder="help"></label><button>RUN</button></form></div>';main.append(section);const output=$(".fn-terminal-output",section),form=$(".fn-terminal-form",section),input=$("input",form);form.addEventListener("submit",e=>{e.preventDefault();const cmd=input.value.trim().toLowerCase();input.value="";const line=document.createElement("p");line.textContent="visitor@folio:~$ "+cmd;output.append(line);const result=document.createElement("p");const routes={help:"commands: help, about, home, projects, news, contact, lab, gallery, status, versions, favorites, history, clear",about:"folio. — Independent Product Studio. Ideas into something real.",home:"index.html",projects:"projects.html",news:"news.html",contact:"contact.html",lab:"lab.html",gallery:"gallery.html",status:"status.html",versions:"versions.html",favorites:"favorites.html",history:"history.html"};if(cmd==="clear"){output.replaceChildren()}else if(routes[cmd]){result.textContent=["home","projects","news","contact","lab","gallery","status","versions","favorites","history"].includes(cmd)?"ページへ移動します。":routes[cmd];output.append(result);if(["home","projects","news","contact","lab","gallery","status","versions","favorites","history"].includes(cmd)){const a=document.createElement("a");a.href=routes[cmd];a.textContent="ページを開く ↗";output.append(a)}}else{result.textContent="Unknown command. help を入力してください。";output.append(result)}output.scrollTop=output.scrollHeight})}
if(currentFile==="gallery.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / SELECTED VISUALS</p><h1>Project <em>Gallery.</em></h1><p>既存プロジェクトのビジュアルを一覧できます。キーワードで絞り込めます。</p><label class="fn-gallery-search"><span>SEARCH PROJECTS</span><input type="search" placeholder="プロジェクト名・説明で検索" aria-label="ギャラリーを検索"></label><p class="fn-gallery-count" aria-live="polite"></p>';const grid=buildGallery();section.append(grid);main.append(section);const input=$(".fn-gallery-search input",section),count=$(".fn-gallery-count",section);const filter=()=>{const q=input.value.trim().toLocaleLowerCase("ja");let n=0;$(".fn-gallery-card",grid).forEach(card=>{card.hidden=!card.textContent.toLocaleLowerCase("ja").includes(q);if(!card.hidden)n++});count.textContent=n+" / "+grid.children.length+" PROJECTS"};input.addEventListener("input",filter);filter()}
if(currentFile==="status.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / SYSTEM STATUS</p><h1>System <em>Status.</em></h1><p>各プロジェクトの掲載情報から開発段階を表示しています。外部サービスの稼働監視を示すものではありません。</p>';section.append(statusContent());main.append(section)}
if(currentFile==="versions.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / CHANGELOG</p><h1>Version <em>History.</em></h1><p>folio.の機能追加・改善を記録する更新履歴です。</p><article class="fn-empty-state"><b>2026.11.25 / FOLIO NEXT — FOUNDATION</b><h2>新機能の基盤を追加</h2><p>folio. LAB、コマンドパレット、System Status、Project Gallery、folio. Terminalなどの新機能ページと共通インタラクション基盤を追加。既存のページ構成・コンテンツを維持した拡張を開始しました。</p><span>FEATURE / FOUNDATION UPDATE</span></article>';main.append(section)}
if(currentFile==="favorites.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / YOUR SPACE</p><h1>Your <em>Favorites.</em></h1><p>PROJECTSページやプロジェクト詳細で保存した項目をまとめています。</p>';const list=document.createElement("div");list.className="fn-favorite-list";const render=()=>{list.replaceChildren();const ids=safe(favKey,[]);ids.forEach(id=>{const row=document.createElement("div");row.className="fn-saved-row";const a=document.createElement("a");a.href="project.html?id="+encodeURIComponent(id);a.textContent=(projectNames[id]||id)+" ↗";const remove=button("削除",()=>{save(favKey,safe(favKey,[]).filter(x=>x!==id));render();document.dispatchEvent(new CustomEvent("folio:favorites-change"));toast("お気に入りから削除しました")},"fn-remove");row.append(a,remove);list.append(row)});if(!list.children.length){const p=document.createElement("p");p.textContent="お気に入りはまだありません。PROJECTSページで「お気に入り」を押して追加できます。";list.append(p)}};render();section.append(list);main.append(section);document.addEventListener("folio:favorites-change",render)}
if(currentFile==="history.html"){const main=$("main")||document.body;const section=document.createElement("section");section.className="fn-feature-page";section.innerHTML='<p class="fn-kicker">FOLIO / YOUR SPACE</p><h1>Recently <em>Viewed.</em></h1><p>この端末で最近開いたページとプロジェクトを表示します。</p>';const list=document.createElement("div");list.className="fn-favorite-list";const render=()=>{list.replaceChildren();const pages=safe(histKey,[]),projectIds=safe("folio-recent-v1",[]);const merged=[...pages,...projectIds.map(id=>({url:"project.html?id="+encodeURIComponent(id),name:projectNames[id]||id,date:0}))].filter((item,i,arr)=>arr.findIndex(x=>x.url===item.url)===i).slice(0,30);merged.forEach(item=>{const link=document.createElement("a");link.href=item.url;link.textContent=item.name+" ↗";list.append(link)});if(!list.children.length)list.textContent="閲覧履歴はありません。"};const clear=button("履歴をすべて削除",()=>{save(histKey,[]);save("folio-recent-v1",[]);render();toast("閲覧履歴を削除しました")},"fn-remove-all");render();section.append(clear,list);main.append(section)}
/* publish date counter: deliberately unset until the studio confirms the actual date */
if(currentFile==="index.html"){const target=$(".studio-strip");if(target){const item=document.createElement("div");item.className="fn-launch-counter";item.innerHTML="<strong>未設定</strong><span>LAUNCH DATE</span>";item.title="正式なサイト公開日が設定されると日数を表示します";target.append(item)}}

})();
/* Data-backed views: load the canonical project list on standalone feature pages. */
(function(){
 const file=location.pathname.split("/").pop();
 if(!["status.html","gallery.html"].includes(file))return;
 fetch("projects.html").then(r=>{if(!r.ok)throw new Error("projects unavailable");return r.text()}).then(html=>{
  const doc=new DOMParser().parseFromString(html,"text/html");
  const rows=[...doc.querySelectorAll(".project-row")];
  const main=document.querySelector("main");
  if(file==="status.html"){
   const target=document.querySelector(".fn-status-list");if(!target)return;target.replaceChildren();
   rows.forEach(row=>{const item=document.createElement("div");item.className="fn-status-row";const name=document.createElement("b");name.textContent=row.querySelector("h2")?.textContent||row.id;const status=document.createElement("span");status.textContent=row.querySelector(".status")?.textContent||"STATUS NOT SET";item.append(name,status);target.append(item)});
  }
  if(file==="gallery.html"){
   const target=document.querySelector(".fn-gallery-grid");if(!target)return;target.replaceChildren();
   rows.forEach(row=>{const card=document.createElement("a");card.className="fn-gallery-card";card.href="project.html?id="+encodeURIComponent(row.id);const art=row.querySelector(".row-mark svg");if(art)card.append(art.cloneNode(true));const name=document.createElement("b");name.textContent=row.querySelector("h2")?.textContent||row.id;const desc=document.createElement("p");desc.textContent=row.querySelector("p")?.textContent||"";card.append(name,desc);target.append(card)});document.querySelector(".fn-gallery-search input")?.dispatchEvent(new Event("input"));
  }
 }).catch(()=>{const target=document.querySelector(".fn-status-list,.fn-gallery-grid");if(target){const note=document.createElement("p");note.textContent="プロジェクト情報を読み込めませんでした。PROJECTSページをご確認ください。";target.append(note)}});
})();

/* Simple, reliable in-site back control */
(function(){
 const path=location.pathname.split("/").pop()||"index.html";
 if(path==="index.html"||path==="")return;
 const main=document.querySelector("main");
 if(!main||document.querySelector(".folio-back-control"))return;
 const fallback=path==="project.html"?"projects.html":"index.html";
 const back=document.createElement("button");
 back.type="button";
 back.className="folio-back-control";
 back.innerHTML='<span aria-hidden="true">←</span><span>戻る</span>';
 back.setAttribute("aria-label","前のページに戻る");
 back.addEventListener("click",()=>{
  let internal=false;
  try{internal=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch{}
  if(internal&&history.length>1){history.back();return}
  location.assign(fallback);
 });
 main.prepend(back);
})();

/* folio. information architecture: six primary destinations, utilities stay in discovery tools */
(function(){
 const nav=document.querySelector(".topbar nav"),header=document.querySelector(".topbar");
 if(!nav||!header)return;
 const items=[
  ["HOME","index.html"],["PROJECTS","projects.html"],["PLAY","play.html"],["STUDIO","brand.html"],["JOURNAL","news.html"],["ABOUT","about.html"],["CONTACT","contact.html"],["ログイン","account.html"]
 ];
 nav.replaceChildren();
 const current=location.pathname.split("/").pop()||"index.html";
 items.forEach(([label,href])=>{
  const a=document.createElement("a");a.href=href;a.textContent=label;
  const active=href===current||(current==="project.html"&&href==="projects.html");
  if(active){a.classList.add("active");a.setAttribute("aria-current","page")}
  a.addEventListener("click",()=>{nav.classList.remove("open");header.querySelector(".menu")?.setAttribute("aria-expanded","false")});
  nav.append(a);
 });
 nav.setAttribute("aria-label","メインナビゲーション");
 const menu=header.querySelector(".menu");
 if(menu){menu.setAttribute("aria-controls","folio-main-nav");nav.id="folio-main-nav"}
})();


/* EN / JP language switch — persistent, page-wide and safe for dynamic UI */
(function(){
 "use strict";
 const KEY="folio-language";
 const translations={
 "HOME":"HOME","PROJECTS":"PROJECTS","PLAY":"PLAY","STUDIO":"STUDIO","JOURNAL":"JOURNAL","ABOUT":"ABOUT","CONTACT":"CONTACT",
 "メインナビゲーション":"Main navigation","メニュー":"Menu","テーマを切り替える":"Toggle theme","ライト／ダーク切り替え":"Toggle light / dark theme",
 "Ideas, made useful":"Ideas, made useful","ブランド概要":"Brand overview","お知らせ":"News & updates","プロジェクトを見る":"Explore projects",
 "アイデアを、設計する。かたちにする。":"Design ideas. Build them into reality.",
 "folioは、アイデアをデジタルプロダクトへ育てるプロダクトスタジオです。":"folio is an independent product studio turning ideas into thoughtful digital products.",
 "folioは、日常の小さな気づきからプロダクトを考え、デザインと技術で形にしていくスタジオです。企画から試作、改善までのプロセスを大切にしています。":"folio turns everyday observations into products through design and technology. We value the entire process, from planning and prototyping to continuous improvement.",
 "ブランド概要":"Brand overview","SELECTED WORK":"SELECTED WORK","Things in motion":"Things in motion",
 "毎日の学習を、もっと整理して前へ。":"Organise daily learning and keep moving forward.",
 "自分の基準で動く、パーソナルAI構想。":"A personal AI concept built around your own principles.",
 "決済体験を考えるUI・機能開発。":"Exploring payment experiences through thoughtful UI and features.",
 "プロジェクトを検索...":"Search projects...","プロジェクト名・キーワード":"Project name or keyword",
 "すべて":"All","開発中":"In development","構想":"Concept","詳細を見る":"View details","詳細を見る ↗":"View details ↗",
 "アイデアから生まれたプロジェクト。構想中のものも、開発中のものも含めて記録しています。":"Projects born from ideas. This collection includes concepts, works in progress and experiments.",
 "プロジェクトを検索":"Search projects","並び替え":"Sort by","おすすめ順":"Featured","名前順 A–Z":"Name A–Z","名前順 Z–A":"Name Z–A",
 "カテゴリー":"Category","ステータス":"Status","RESET":"RESET","検索結果がありません":"No results found",
 "何をお探しですか？":"What are you looking for?","ページ・プロジェクト・操作を検索...":"Search pages, projects and actions...",
 "すべて":"All","ページ":"Pages","プロジェクト":"Projects","操作":"Actions","閉じる":"Close",
 "コマンドパレット":"Command palette","共有センター":"Share center","お気に入り":"Favourites","閲覧履歴":"Recently viewed",
 "お気に入りに追加":"Add to favourites","お気に入りから削除":"Remove from favourites",
 "プロジェクト一覧":"All projects","プロジェクトを探す":"Explore projects","最新情報":"Latest updates",
 "THE STUDIO":"THE STUDIO","BRAND OVERVIEW":"BRAND OVERVIEW","ALL PROJECTS":"ALL PROJECTS","EXPLORE PROJECTS":"EXPLORE PROJECTS",
 "IN DEVELOPMENT":"IN DEVELOPMENT","CONCEPT":"CONCEPT","PROJECT":"PROJECT","EDUCATION":"EDUCATION",
 "学習タスク・固定予定・進捗をまとめ、日々の学習計画を組み立てるツール。予定の自動調整や振り返り機能を構想し、使いやすい学習体験を目指しています。":"A study-planning tool that brings tasks, fixed schedules and progress together. It aims to make learning easier through features such as schedule adjustments and reviews.",
 "自分の考え方や判断基準を大切にするパーソナルAI構想。勉強のサポートから日常の整理まで、根拠と実行しやすさを重視します。":"A personal AI concept shaped around individual thinking and decision-making. It aims to support study and everyday organisation with evidence-based, actionable guidance.",
 "社会科の知識をクイズ形式で確認できる学習サイト。繰り返し取り組みやすい構成と、理解度を高める体験を目指しています。":"A quiz-based learning site for reviewing social studies. Designed to make practice approachable and help build understanding.",
 "QRコードを使った支払いの流れを題材に、利用者向け画面や店舗側画面、セルフレジなどのUIと操作性を研究・制作。":"An exploration of QR-based payment experiences, including customer and merchant interfaces and self-checkout concepts.",
 "席替えや座席管理をサポートするツール。操作のわかりやすさと、実際の利用場面を意識した機能設計に取り組んでいます。":"A tool concept for seating arrangements and seat management, designed around clear interactions and practical use.",
 "来客受付をデジタル化するサイト。受付フォーム、管理者向け一覧、端末ごとの表示など、シンプルで使いやすい仕組みを目指します。":"A digital visitor reception concept, with a simple workflow for forms, management views and different devices.",
 "国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭の9科目から、好きな教科を選んでクイズに挑戦できる学習サイト。":"A study site where learners can choose from nine school subjects and practise with quizzes.",
 "ホーム":"Home","プロジェクト":"Projects","ブランド":"Studio","ニュース":"Journal","お問い合わせ":"Contact",
 "ページが見つかりません":"Page not found","トップページへ戻る":"Back to home","前のページへ戻る":"Go back"
 };
 const replacements=Object.entries(translations).sort((a,b)=>b[0].length-a[0].length);
 let lang="ja";
 try{lang=localStorage.getItem(KEY)==="en"?"en":"ja"}catch{}
 const translateString=s=>{if(lang!=="en")return s;let out=s;for(const [ja,en] of replacements){if(out.includes(ja))out=out.split(ja).join(en)}return out};
 const originals=new WeakMap();
 const translateNode=node=>{
  if(node.nodeType===Node.TEXT_NODE){if(!originals.has(node))originals.set(node,node.nodeValue);const source=originals.get(node);const next=translateString(source);if(node.nodeValue!==next)node.nodeValue=next}
  else if(node.nodeType===Node.ELEMENT_NODE){
   ["placeholder","aria-label","title","alt"].forEach(attr=>{if(node.hasAttribute(attr)){const key="data-folio-original-"+attr;if(!node.hasAttribute(key))node.setAttribute(key,node.getAttribute(attr));const source=node.getAttribute(key);const next=translateString(source);if(node.getAttribute(attr)!==next)node.setAttribute(attr,next)}});
   node.childNodes.forEach(translateNode);
  }
 };
 const apply=()=>{
  lang=lang==="en"?"en":"ja";
  document.documentElement.lang=lang;
  document.querySelectorAll("title").forEach(el=>{if(!el.dataset.folioOriginal)el.dataset.folioOriginal=el.textContent;el.textContent=translateString(el.dataset.folioOriginal)});
  translateNode(document.body);
  const toggle=document.querySelector(".folio-language-switch");
  if(toggle){toggle.innerHTML='<span class="'+(lang==="ja"?"is-active":"")+'">JP</span><i></i><span class="'+(lang==="en"?"is-active":"")+'">EN</span>';toggle.setAttribute("aria-label",lang==="ja"?"Switch language to English":"言語を日本語に切り替え");toggle.setAttribute("aria-pressed",String(lang==="en"))}
 };
 const header=document.querySelector(".topbar");
 if(header){
  const toggle=document.createElement("button");toggle.type="button";toggle.className="folio-language-switch";toggle.setAttribute("aria-label","Switch language to English");toggle.innerHTML='<span>JP</span><i></i><span>EN</span>';
  const menu=header.querySelector(".menu");
  header.insertBefore(toggle,menu||null);
  toggle.addEventListener("click",()=>{lang=lang==="ja"?"en":"ja";try{localStorage.setItem(KEY,lang)}catch{}apply()});
 }
 apply();
 const observer=new MutationObserver(records=>records.forEach(record=>{record.addedNodes.forEach(node=>{if(node.nodeType===Node.ELEMENT_NODE||node.nodeType===Node.TEXT_NODE)translateNode(node)});if(record.type==="characterData")translateNode(record.target)}));
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();


/* FOLIO STUDIO HUB — clear discovery paths and global utility navigation. */
(function(){
 "use strict";
 const $=(s,r=document)=>r.querySelector(s);
 const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
 const routes=[
  ["PROJECTS","プロジェクト一覧","projects.html","01"],
  ["folio. LAB","実験・アイデア","lab.html","02"],
  ["PROJECT GALLERY","ビジュアル一覧","gallery.html","03"],
  ["folio. Terminal","コマンドで探索","terminal.html","04"],
  ["SYSTEM STATUS","開発ステージ","status.html","05"],
  ["NEWS & JOURNAL","最新情報","news.html","06"]
 ];
 if((location.pathname.split("/").pop()||"index.html")==="index.html"){
  const main=$("main"),anchor=$(".folio-explore",main);
  if(main&&!$(".fp-studio-hub",main)){
   const section=make("section","fp-studio-hub wrap");
   const head=make("div","fp-hub-head");
   const copy=make("div");
   copy.append(make("p","fp-kicker","THE FOLIO WORKSPACE"),make("h2","", "Explore the studio."),make("p","fp-hub-intro","プロジェクト、実験、開発状況。folio.の活動をひとつの場所から探索できます。"));
   const link=make("a","fp-hub-all","すべてのプロジェクトを見る ↗");link.href="projects.html";
   head.append(copy,link);
   const grid=make("div","fp-hub-grid");
   routes.forEach(([name,desc,url,no])=>{
    const a=make("a","fp-hub-card");a.href=url;
    a.append(make("span","fp-hub-no",no+" / FOLIO"),make("b","",name),make("span","",desc),make("i","","↗"));
    grid.append(a);
   });
   const foot=make("div","fp-hub-foot");
   foot.append(make("span","","A CLEARER WAY TO EXPLORE"),make("span","","PLAN · DESIGN · BUILD · IMPROVE"));
   section.append(head,grid,foot);
   if(anchor)anchor.insertAdjacentElement("beforebegin",section);else main.append(section);
  }
 }
 /* A consistent utility directory is available from every page, without crowding the primary navigation. */
 const footer=$("footer.footer");
 if(footer&&!$(".fp-utility-nav")){
  const utility=make("nav","fp-utility-nav");utility.setAttribute("aria-label","Folio utility navigation");
  const title=make("div","fp-utility-title");title.append(make("b","","EXPLORE FOLIO"),make("span","","TOOLS & RESOURCES"));
  const links=make("div","fp-utility-links");
  [["LAB","lab.html"],["GALLERY","gallery.html"],["STATUS","status.html"],["TERMINAL","terminal.html"],["FAVORITES","favorites.html"],["HISTORY","history.html"],["VERSIONS","versions.html"],["SITE MAP","sitemap.html"]].forEach(([label,url])=>{const a=make("a","",label+" ↗");a.href=url;links.append(a)});
  utility.append(title,links);footer.insertAdjacentElement("beforebegin",utility);
 }
 /* Scroll-to-top is deliberately independent from the existing share control. */
 if(!$(".fp-back-top")){
  const top=make("button","fp-back-top","↑");top.type="button";top.setAttribute("aria-label","ページの先頭へ戻る");top.title="ページの先頭へ";
  top.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
  document.body.append(top);
  let ticking=false;
  const update=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{top.classList.toggle("is-visible",window.scrollY>420);ticking=false})};
  window.addEventListener("scroll",update,{passive:true});update();
 }
 /* Slash opens global search when focus is not inside an editable control. */
 document.addEventListener("keydown",event=>{
  if(event.key!=="/"||event.metaKey||event.ctrlKey||event.altKey)return;
  const target=event.target;
  if(target instanceof HTMLElement&&(target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(target.tagName)))return;
  event.preventDefault();document.dispatchEvent(new CustomEvent("folio:open-command"));
 });
})();
