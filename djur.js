(function(){
"use strict";
if(typeof DJUR==="undefined"){document.getElementById("view").textContent="Materialet kunde inte laddas. Uppdatera sidan.";return;}
const root=document.getElementById("view"), statbar=document.getElementById("stats"),nav=document.getElementById("navigation");
const KEY="vilja-biologi-djur-v1";
const defaults={studied:[],bad:[],cardWeak:[],essayDrafts:{},essayRatings:{},quizHistory:[],examHistory:[],examDraft:null,lastExam:null};
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||"{}");return {...defaults,...s,studied:Array.isArray(s.studied)?s.studied:[],bad:Array.isArray(s.bad)?s.bad:[],cardWeak:Array.isArray(s.cardWeak)?s.cardWeak:[],essayDrafts:s.essayDrafts||{},essayRatings:s.essayRatings||{},quizHistory:Array.isArray(s.quizHistory)?s.quizHistory:[],examHistory:Array.isArray(s.examHistory)?s.examHistory:[]};}catch(e){return {...defaults};}}
let saved=load(),mode="home",lesson=0,cards=null,practice=null,match=null,essay=0,essayReveal=false,examStage="intro";
const $=id=>document.getElementById(id);
const esc=v=>String(v===null||v===undefined?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const topic=id=>DJUR.topics.find(x=>x.id===id)||DJUR.topics[0];
const stamp=()=>new Date().toLocaleDateString("sv-SE",{day:"numeric",month:"short"});
const percent=(n,d)=>d?Math.round(n/d*100):0;
function store(){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch(e){}}
function unique(list){return [...new Set(list)];}
function markBad(id,bad){saved.bad=bad?unique([...saved.bad,id]):saved.bad.filter(x=>x!==id);store();}
function button(label,action,extra="",className="primary"){return '<button class="'+className+'" data-action="'+action+'" '+extra+'>'+label+'</button>';}
function progress(n,d){return '<div class="track" aria-label="'+n+' av '+d+'"><span style="width:'+percent(n,d)+'%"></span></div>';}
function updateStats(){
 const studied=saved.studied.length,best=saved.examHistory.length?Math.max(...saved.examHistory.map(x=>Number(x.score)||0)):null;
 statbar.innerHTML='<div class="stat"><div class="statIcon">📚</div><div><strong>'+studied+' / '+DJUR.topics.length+'</strong><small>Kapitel genomgångna</small></div></div>'+
 '<div class="stat"><div class="statIcon">🏆</div><div><strong>'+(best===null?'–':best+' / 20')+'</strong><small>Bästa faktaprovet</small></div></div>'+
 '<div class="stat"><div class="statIcon">🎯</div><div><strong>'+saved.bad.length+'</strong><small>Frågor att öva på</small></div></div>';
}
function place(html){root.innerHTML=html;updateStats();}
function scrollPanel(){requestAnimationFrame(()=>{const top=window.scrollY+root.getBoundingClientRect().top-80;window.scrollTo({top:Math.max(0,top),behavior:"smooth"});});}
function go(target,opts={}){
 if(target==="quiz"&&(!practice||practice.kind!=="quiz"||opts.restart)){startPractice("quiz",opts);}
 if(target==="tf"&&(!practice||practice.kind!=="tf"||opts.restart)){startPractice("tf",opts);}
 if(target==="cards"&&(!cards||opts.restart)){cards={items:shuffle(DJUR.terms),index:0,flipped:false,ok:0};}
 if(target==="match"&&(!match||opts.restart)){newMatch();}
 if(target==="study"&&opts.topic){lesson=Math.max(0,DJUR.topics.findIndex(x=>x.id===opts.topic));}
 if(target==="essay"&&opts.index!==undefined){essay=Number(opts.index)||0;essayReveal=false;}
 if(target==="exam"){examStage=saved.examDraft?"question":"intro";}
 mode=target;
 nav.querySelectorAll("[data-nav]").forEach(b=>{const on=b.dataset.nav===target;b.classList.toggle("active",on);b.setAttribute("aria-current",on?"page":"false");});
 const render={home:renderHome,study:renderStudy,cards:renderCards,quiz:renderPractice,tf:renderPractice,match:renderMatch,essay:renderEssay,exam:renderExam}[mode];
 if(render)render();
 if(!opts.noScroll)scrollPanel();
}
function renderHome(){
 const tiles=[
 ["📖","Läs & lär","9 tydliga kapitel med förklaringar och exempel.","study","9 kapitel"],
 ["🧠","Minneskort","Vänd kort och öva på 28 viktiga begrepp.","cards","28 begrepp"],
 ["⚡","Snabbquiz","Flervalsfrågor med förklaring efter varje svar.","quiz","30 frågor"],
 ["✅","Sant eller falskt","Lär dig genom att hitta vanliga missförstånd.","tf","28 påståenden"],
 ["🧩","Para ihop","Matcha biologins begrepp med rätt förklaring.","match","Minispel"],
 ["✍️","Resonera","Öva längre svar och jämför med stödorden.","essay","10 resonemang"]
 ];
 place('<div class="feature"><div><div class="eyeline">🎓 DITT AKTUELLA PROV</div><h2>Biologi: Djurens värld</h2><p>Provet har två delar: flervalsfrågor och sant/falskt, plus öppna frågor där du förklarar och jämför. Precis som i lärarens häfte.</p></div><button class="featureAction" data-nav="exam">Öppna slutprovet →</button></div>'+
 '<section class="surface"><div class="sectionHead"><div><div class="eyeline">VÄLJ HUR DU VILL TRÄNA</div><h2>Gör pluggandet roligt ✨</h2><p>Växla mellan att läsa, spela och testa dig.</p></div><span class="badge teal">Ditt eget tempo</span></div><div class="cardsGrid">'+tiles.map(t=>'<article class="tile"><span class="tileIcon">'+t[0]+'</span><h3>'+t[1]+'</h3><p>'+t[2]+'</p><span class="badge" style="margin:0 0 12px">'+t[4]+'</span><button data-nav="'+t[3]+'">Öppna övning →</button></article>').join("")+'</div></section>'+
 (saved.bad.length?'<section class="surface"><div class="sectionHead"><div><div class="eyeline">PERSONLIG REPETITION</div><h3>🎯 Träna på det som var svårt</h3><p>Det finns '+saved.bad.length+' markerade frågor att repetera.</p></div>'+button('Öva mina fel','review','','softBtn')+'</div></section>':'')+
 '<section class="surface"><div class="sectionHead"><div><div class="eyeline">KUNSKAPSKARTA</div><h2>De 9 områdena</h2><p>Tryck på ett område för att läsa och markera när det är klart.</p></div><span class="badge gold">'+saved.studied.length+' av 9 klara</span></div>'+progress(saved.studied.length,DJUR.topics.length)+'<div class="miniGrid">'+DJUR.topics.map(t=>'<button class="topicMini '+(saved.studied.includes(t.id)?"done":"")+'" data-action="topic" data-topic="'+t.id+'"><span class="topicEmoji">'+t.icon+'</span><span><b>'+esc(t.title)+'</b><small>'+(saved.studied.includes(t.id)?"✓ Genomgången":esc(t.tag))+'</small></span></button>').join("")+'</div></section>');
}
function renderStudy(){
 const t=DJUR.topics[lesson],done=saved.studied.includes(t.id);
 place('<section class="surface"><div class="sectionHead"><div><div class="eyeline">LÄS & LÄR</div><h2>Kapitel '+(lesson+1)+' av '+DJUR.topics.length+'</h2><p>Läs, tänk efter och markera när du känner att du förstår.</p></div><span class="badge teal">'+saved.studied.length+' klara</span></div>'+progress(lesson+1,DJUR.topics.length)+'</section>'+
 '<article class="lesson"><div class="lessonTop"><span class="lessonEmoji">'+t.icon+'</span><div><span class="eyeline">'+esc(t.tag)+'</span><h2>'+esc(t.title)+'</h2><p>'+esc(t.intro)+'</p></div></div>'+
 '<ul class="facts">'+t.facts.map(f=>'<li>'+esc(f)+'</li>').join("")+'</ul><div class="remember"><b>⭐ Kom ihåg</b>'+esc(t.remember)+'</div><div class="example"><b>💡 Exempel</b>'+esc(t.example)+'</div>'+
 '<div class="footnav"><button class="ghostBtn" data-action="prevTopic" '+(lesson===0?"disabled":"")+'>← Förra kapitlet</button>'+button(done?'✓ Jag har läst detta':'✓ Jag förstår kapitlet',done?'unreadTopic':'readTopic','','softBtn')+'<button class="primary" data-action="nextTopic">'+(lesson===DJUR.topics.length-1?'Till översikten':'Nästa kapitel →')+'</button></div></article>'+
 '<section class="surface"><div class="sectionHead"><div><div class="eyeline">ALLA OMRÅDEN</div><h3>Hoppa till ett kapitel</h3></div></div><div class="miniGrid">'+DJUR.topics.map((x,i)=>'<button class="topicMini '+(saved.studied.includes(x.id)?"done":"")+'" data-action="topic" data-topic="'+x.id+'"><span class="topicEmoji">'+x.icon+'</span><span><b>'+esc(x.title)+'</b><small>'+((i===lesson?"▶ Visas nu · ":"")+(saved.studied.includes(x.id)?"Klart":"Kapitel "+(i+1)))+'</small></span></button>').join("")+'</div></section>');
}
function renderCards(){
 if(!cards){cards={items:shuffle(DJUR.terms),index:0,flipped:false,ok:0};}
 if(cards.index>=cards.items.length){
  place('<section class="testCard center"><span style="font-size:60px">🏅</span><h2>Alla minneskort avklarade!</h2><p>Du kunde <b>'+cards.ok+' av '+cards.items.length+'</b> begrepp under den här omgången. '+(saved.cardWeak.length?'Du har '+saved.cardWeak.length+' begrepp markerade som svåra.':'Härligt jobbat!')+'</p><div class="actions" style="justify-content:center">'+button("Träna igen","cardsRestart")+button("Till översikten","homeAction",'','secondary')+'</div></section>');
  return;
 }
 const t=cards.items[cards.index];
 place('<section class="surface"><div class="sectionHead"><div><div class="eyeline">MINNESKORT</div><h2>Kan du förklara ordet?</h2><p>Försök säga vad ordet betyder innan du vänder kortet.</p></div><span class="badge">'+(cards.index+1)+' / '+cards.items.length+'</span></div>'+progress(cards.index+1,cards.items.length)+'</section>'+
 '<section class="testCard"><div class="questionTag">'+topic(t.topic).icon+' '+esc(topic(t.topic).tag)+'</div><div class="cardStage '+(cards.flipped?'flipped':'')+'"><div class="'+(cards.flipped?'definition':'term')+'">'+esc(cards.flipped?t.definition:t.term)+'</div><small>'+(cards.flipped?'Hur gick det? Markera nedan.':'Tryck på kortet för att se förklaringen')+'</small><button data-action="flipCard" aria-label="Vänd minneskortet"></button></div>'+
 '<div class="actions" style="justify-content:center;margin-top:17px">'+(cards.flipped?button("👍 Jag kan det","cardGood")+button("🔁 Behöver öva","cardWeak",'','secondary'):button("Vänd kortet","flipCard"))+'</div><p class="center" style="color:#708494;font-size:12px;margin-top:14px">Begrepp att repetera: '+saved.cardWeak.length+'</p></section>');
}
function startPractice(kind,opts={}){
 let pool=kind==="tf"?DJUR.trueFalse:DJUR.quiz;
 if(opts.topic)pool=pool.filter(x=>x.topic===opts.topic);
 practice={kind,items:shuffle(pool).slice(0,Math.min(12,pool.length)),index:0,picked:null,revealed:false,responses:[],title:opts.topic?topic(opts.topic).title:(kind==="tf"?"Sant eller falskt":"Snabbquiz")};
}
function expected(q){return q.options?q.correct:(q.correct?0:1);}
function choices(q){return q.options||["Sant","Falskt"];}
function prompt(q){return q.question||q.text;}
function practiceScore(){return practice.responses.filter(r=>r.correct).length;}
function renderPractice(){
 if(!practice||!practice.items.length){place('<section class="stateEmpty"><h3>Inga frågor här ännu</h3></section>');return;}
 if(practice.index>=practice.items.length){renderPracticeDone();return;}
 const q=practice.items[practice.index],done=practice.revealed,right=expected(q);
 const opts=choices(q).map((o,i)=>{const cls=done?(i===right?"correct":i===practice.picked?"incorrect":""):(i===practice.picked?"picked":"");
 return '<button class="option '+cls+'" data-action="practicePick" data-option="'+i+'" '+(done?"disabled":"")+'><span class="optionLetter">'+(q.options?String.fromCharCode(65+i):(i===0?"S":"F"))+'</span><span>'+esc(o)+'</span></button>';}).join("");
 const good=practice.picked===right;
 place('<section class="surface"><div class="split"><div><div class="eyeline">'+(practice.kind==="tf"?"SANT ELLER FALSKT":practice.kind==="review"?"TRÄNA SVÅRA FRÅGOR":"SNABBQUIZ")+'</div><h2 style="margin:4px 0">'+esc(practice.title)+'</h2></div><div class="quizmeta"><span>Fråga '+(practice.index+1)+' / '+practice.items.length+'</span><strong>⭐ '+practiceScore()+' rätt</strong></div></div>'+progress(practice.index+1,practice.items.length)+'</section>'+
 '<section class="testCard"><div class="questionTag">'+topic(q.topic).icon+' '+esc(topic(q.topic).title)+'</div><h2 class="question">'+esc(prompt(q))+'</h2><div class="options">'+opts+'</div>'+
 (done?'<div class="feedback '+(good?"good":"bad")+'"><b>'+(good?"✓ Rätt svar!":"↪ Inte riktigt – nu lärde du dig något!")+'</b><div>'+esc(q.why)+'</div></div>':'')+
 '<div class="actions">'+(done?button(practice.index===practice.items.length-1?"Visa resultat →":"Nästa fråga →","practiceNext"):button("Rätta mitt svar","practiceCheck",practice.picked===null?"disabled":""))+button("Börja om","practiceRestart",'','ghostBtn')+'</div></section>');
}
function renderPracticeDone(){
 const total=practice.items.length,score=practiceScore();
 saved.quizHistory.push({date:new Date().toISOString(),kind:practice.kind,score,total});saved.quizHistory=saved.quizHistory.slice(-40);store();
 // Avoid duplicate history write on rerender
 practice.finished=true;
 const misses=practice.responses.filter(x=>!x.correct);
 place('<section class="testCard"><div class="scoreHero"><div class="scoreDial" style="--percent:'+percent(score,total)+'%"><span>'+score+' / '+total+'<small>RÄTT</small></span></div><div><div class="eyeline">ÖVNING KLAR!</div><h2 style="font-size:29px;margin:6px 0">'+(score===total?'Full pott! 🌟':'Bra jobbat, Vilja! 🌟')+'</h2><p style="margin:0;color:var(--muted)">'+(misses.length?'Här är frågorna att öva lite extra på.':'Du satte alla frågorna – snyggt!')+'</p></div></div><div class="actions">'+button("Gör en ny omgång","practiceRestart")+button("Välj annan övning","homeAction",'','secondary')+(saved.bad.length?button("Träna svåra frågor","review",'','softBtn'):'')+'</div></section>'+
 (misses.length?'<section class="surface"><div class="sectionHead"><h3>Det här vill vi repetera</h3><span class="badge gold">'+misses.length+' frågor</span></div>'+misses.map(r=>{const q=(DJUR.quiz.find(x=>x.id===r.id)||DJUR.trueFalse.find(x=>x.id===r.id));return '<div class="reviewItem isWrong"><b>'+esc(prompt(q))+'</b><p>Rätt svar: '+esc(choices(q)[expected(q)])+'</p><p>'+esc(q.why)+'</p></div>';}).join('')+'</section>':'');
}
function newMatch(){
 const items=shuffle(DJUR.terms).slice(0,6);
 match={items,left:shuffle(items),right:shuffle(items),leftPick:null,rightPick:null,matched:[],mistakes:0,message:""};
}
function renderMatch(){
 if(!match)newMatch();
 const finished=match.matched.length===match.items.length;
 place('<section class="surface"><div class="sectionHead"><div><div class="eyeline">🧩 BEGREPPSMATCH</div><h2>Para ihop rätt!</h2><p>Välj ett ord till vänster och rätt förklaring till höger.</p></div><span class="badge teal">'+match.matched.length+' / 6 par</span></div>'+progress(match.matched.length,6)+'</section>'+
 (finished?'<section class="testCard center"><span style="font-size:57px">🎉</span><h2>Alla sex par rätt!</h2><p>Du löste matchningen med '+match.mistakes+' felmatchningar. Vill du prova sex nya?</p>'+button("Spela igen","matchRestart")+'</section>':
 '<section class="surface"><div class="matchGrid"><div class="matchColumn"><div class="eyeline" style="padding-left:6px">BEGREPP</div>'+match.left.map(x=>'<button data-action="matchPick" data-side="left" data-id="'+x.id+'" '+(match.matched.includes(x.id)?'disabled':'')+' class="matchItem '+(match.matched.includes(x.id)?"matched":match.leftPick===x.id?"selected":"")+'">'+esc(x.term)+'</button>').join("")+'</div><div class="matchColumn"><div class="eyeline" style="padding-left:6px">FÖRKLARING</div>'+match.right.map(x=>'<button data-action="matchPick" data-side="right" data-id="'+x.id+'" '+(match.matched.includes(x.id)?'disabled':'')+' class="matchItem '+(match.matched.includes(x.id)?"matched":match.rightPick===x.id?"selected":"")+'">'+esc(x.definition)+'</button>').join("")+'</div></div>'+
 (match.message?'<div class="feedback '+(match.message.startsWith("✓")?"good":"bad")+'">'+esc(match.message)+'</div>':'')+'<div class="actions" style="margin-top:16px">'+button("Nya ord","matchRestart",'','secondary')+'</div></section>'));
}
function renderEssay(){
 const q=DJUR.open[essay]||DJUR.open[0],answer=saved.essayDrafts[q.id]||"",rating=saved.essayRatings[q.id];
 place('<section class="surface"><div class="sectionHead"><div><div class="eyeline">✍️ TRÄNA PÅ ATT RESONERA</div><h2>Svara med egna ord</h2><p>Det viktiga är att förklara <b>varför</b>, jämföra och ge exempel. Ingen automatisk rättning av dina texter.</p></div><span class="badge purple">'+(essay+1)+' / '+DJUR.open.length+'</span></div>'+progress(essay+1,DJUR.open.length)+'</section>'+
 '<section class="essayCard"><div class="questionTag">'+(q.teacher?'⭐ Från lärarens övningshäfte · ':'Extra resonemang · ')+esc(topic(q.topic).title)+'</div><h2 class="question">'+esc(q.question)+'</h2><label for="essayAnswer" style="font-size:13px;font-weight:850;display:block;margin-bottom:7px">Mitt svar</label><textarea id="essayAnswer" class="textAnswer" placeholder="Skriv hur du tänker. Använd exempel och förklara med egna ord...">'+esc(answer)+'</textarea><div class="actions" style="margin-top:12px">'+button(essayReveal?'Dölj exempel':'Visa exempel och checklista','essayReveal','','softBtn')+'</div>'+
 (essayReveal?'<div class="modelAnswer"><b>📘 Ett bra exempelsvar</b>'+esc(q.model)+'</div><h3 style="margin:14px 0 8px">Har du fått med detta?</h3><div class="checklist">'+q.check.map(c=>'<label class="checkrow"><input type="checkbox"><span>'+esc(c)+'</span></label>').join("")+'</div><div class="actions">'+button(rating==="ok"?'✓ Jag kan detta':'👍 Jag kunde förklara','essayGood','','softBtn')+button(rating==="retry"?'✓ Markerad för övning':'🔁 Behöver öva mer','essayWeak','','secondary')+'</div>':'')+
 '<div class="footnav">'+button("← Föregående","essayPrev",essay===0?"disabled":"",'ghostBtn')+'<span class="numberCircle">'+Object.values(saved.essayRatings).filter(x=>x==="ok").length+' svar självrättade</span>'+button(essay===DJUR.open.length-1?"Första frågan →":"Nästa fråga →","essayNext")+'</div></section>');
}
const EXAM_Q=[0,1,2,3,4,5,7,10,17,20,26,28].map(i=>DJUR.quiz[i]);
const EXAM_TF=[2,4,9,12,16,18,23,27].map(i=>DJUR.trueFalse[i]);
const EXAM_ITEMS=[...EXAM_Q,...EXAM_TF,...DJUR.open.slice(0,4)];
const EXAM_CLOSED=[...EXAM_Q,...EXAM_TF];
function startExam(){
 if(saved.examDraft&&!confirm("Vill du börja om? Dina tidigare oskickade provsvar ersätts."))return;
 saved.examDraft={index:0,answers:{},essays:{},started:new Date().toISOString()};store();examStage="question";renderExamQuestion();scrollPanel();
}
function renderExam(){
 if(saved.examDraft){examStage="question";renderExamQuestion();return;}
 if(examStage==="result"&&saved.lastExam){renderExamResult();return;}
 const last=saved.lastExam;
 place('<section class="surface"><div class="sectionHead"><div><div class="eyeline">🎓 SLUTPROV · DJUR</div><h2>Dags att testa allt du kan!</h2><p>Träna på samma typ av frågor som läraren beskriver i provhäftet.</p></div><span class="badge gold">2 delar</span></div><div class="examBanner"><span style="font-size:44px">📋</span><div><strong>20 faktafrågor + 4 öppna frågor</strong><p>Del 1: 12 flervalsfrågor och 8 sant/falskt. Del 2: 4 längre resonemang från lärarens häfte.</p></div></div><p>Du får <b>ingen facitvisning under provet</b>. Efter inlämning rättas faktafrågorna automatiskt. Du jämför dina långa svar med exempelsvar och bedömer dem själv.</p><div class="actions">'+button("Starta slutprovet →","examStart")+(last?button("Se mitt senaste resultat","examShowResult",'','secondary'):'')+'</div>'+(last?'<p style="margin-top:17px;color:var(--muted);font-size:13px">Senaste prov: '+esc(new Date(last.date).toLocaleDateString("sv-SE"))+' · '+last.score+' / '+last.total+' rätt på faktafrågorna.</p>':'')+'</section>');
}
function renderExamQuestion(){
 const d=saved.examDraft;if(!d){renderExam();return;}
 const i=Math.max(0,Math.min(EXAM_ITEMS.length-1,Number(d.index)||0));d.index=i;
 const q=EXAM_ITEMS[i],isOpen=i>=EXAM_CLOSED.length;
 const selected=d.answers[q.id],val=d.essays[q.id]||"";
 const answers=isOpen?'<label for="examText" style="font-size:13px;font-weight:850;display:block;margin-bottom:8px">Ditt utförliga svar</label><textarea id="examText" class="textAnswer" style="min-height:210px" placeholder="Förklara med egna ord. Använd exempel och skriv gärna flera meningar.">'+esc(val)+'</textarea>':
 '<div class="options">'+choices(q).map((o,j)=>'<button class="option '+(selected===j?'picked':'')+'" data-action="examPick" data-option="'+j+'"><span class="optionLetter">'+(q.options?String.fromCharCode(65+j):(j===0?"S":"F"))+'</span><span>'+esc(o)+'</span></button>').join("")+'</div>';
 const factAnswered=EXAM_CLOSED.filter(x=>d.answers[x.id]!==undefined).length;
 const openAnswered=DJUR.open.slice(0,4).filter(x=>(d.essays[x.id]||"").trim()).length;
 place('<section class="surface"><div class="split"><div><div class="eyeline">🎓 SLUTPROV · DEL '+(isOpen?"2":"1")+' AV 2</div><h2 style="margin:4px 0">'+(isOpen?'Förklara & resonera':'Faktafrågor')+'</h2><p style="color:var(--muted);font-size:12px;margin:0">Besvarat: '+factAnswered+' av 20 fakta · '+openAnswered+' av 4 resonemang</p></div><span class="badge">'+(i+1)+' / '+EXAM_ITEMS.length+'</span></div>'+progress(i+1,EXAM_ITEMS.length)+'</section>'+
 '<section class="testCard"><div class="questionTag">'+(isOpen?"✍️ FRÅGA MED EGET SVAR":q.options?"FLERVALSFRÅGA":"SANT ELLER FALSKT")+' · '+esc(topic(q.topic).title)+'</div><h2 class="question">'+esc(prompt(q))+'</h2>'+answers+
 '<div class="footnav">'+button("← Föregående","examPrev",i===0?'disabled':'','ghostBtn')+'<span class="numberCircle">'+(isOpen?'Svara så utförligt du kan':'Välj ett alternativ')+'</span>'+button(i===EXAM_ITEMS.length-1?'Lämna in provet ✓':'Nästa →',i===EXAM_ITEMS.length-1?'examFinish':'examNext')+'</div></section>');
}
function finishExam(){
 const d=saved.examDraft;if(!d)return;
 const unanswered=EXAM_CLOSED.filter(x=>d.answers[x.id]===undefined).length+DJUR.open.slice(0,4).filter(x=>!(d.essays[x.id]||"").trim()).length;
 if(unanswered&& !confirm("Du har "+unanswered+" obesvarade frågor. Vill du ändå lämna in?"))return;
 const right=EXAM_CLOSED.filter(q=>d.answers[q.id]===expected(q)).length;
 const res={date:new Date().toISOString(),score:right,total:EXAM_CLOSED.length,answers:{...d.answers},essays:{...d.essays},grades:{}};
 saved.lastExam=res;
 saved.examHistory.push({date:res.date,score:right,total:EXAM_CLOSED.length});
 saved.examHistory=saved.examHistory.slice(-30);
 EXAM_CLOSED.forEach(q=>markBad(q.id,d.answers[q.id]!==expected(q)));
 saved.examDraft=null;store();examStage="result";renderExamResult();scrollPanel();
}
function renderExamResult(){
 const result=saved.lastExam;if(!result){examStage="intro";renderExam();return;}
 const essays=DJUR.open.slice(0,4),graded=essays.filter(q=>result.grades[q.id]!==undefined),good=essays.filter(q=>result.grades[q.id]===true);
 const wrong=EXAM_CLOSED.filter(q=>result.answers[q.id]!==expected(q));
 place('<section class="surface"><div class="scoreHero"><div class="scoreDial" style="--percent:'+percent(result.score,result.total)+'%"><span>'+result.score+' / '+result.total+'<small>FAKTA RÄTT</small></span></div><div><div class="eyeline">🎉 SLUTPROV GENOMFÖRT</div><h2 style="font-size:30px;margin:5px 0">'+(result.score===result.total?'Full pott, Vilja!':'Bra kämpat, Vilja!')+'</h2><p style="margin:0;color:var(--muted)">Du fick '+result.score+' rätt av '+result.total+' faktafrågor. Rätta även dina fyra resonemang nedan.</p></div></div><div class="actions">'+button("Gör om provet","examStart")+(saved.bad.length?button("Träna på missarna","review",'','secondary'):'')+button("Till översikten","homeAction",'','ghostBtn')+'</div></section>'+
 '<section class="surface"><div class="sectionHead"><div><div class="eyeline">DEL 2 · RESONERA</div><h2>Bedöm dina långa svar</h2><p>Läs ditt svar och jämför med exemplet. Du bestämmer om du fått med det viktigaste.</p></div><span class="badge purple">'+graded.length+' / 4 bedömda</span></div><p><b>'+good.length+' av 4</b> är markerade som bra svar hittills. Det här är en självbedömning, inte automatisk rättning.</p>'+
 essays.map((q,i)=>'<article class="reviewItem" style="padding:18px"><div class="questionTag">FRÅGA '+(i+1)+'</div><h3 style="margin:7px 0 12px;font-size:18px">'+esc(q.question)+'</h3><div style="background:#f6f8fc;border-radius:12px;padding:13px;white-space:pre-wrap;font-size:14px">'+esc(result.essays[q.id]||"Inget svar inlämnat")+'</div><div class="modelAnswer"><b>Exempelsvar</b>'+esc(q.model)+'</div><p style="font-weight:900;font-size:13px;margin-bottom:7px">Det viktiga att få med:</p><div class="checklist">'+q.check.map(c=>'<div class="checkrow"><span style="color:#168e78">✓</span><span>'+esc(c)+'</span></div>').join("")+'</div><div class="actions">'+button(result.grades[q.id]===true?'✓ Bra svar':'👍 Jag kunde detta','examGrade','data-id="'+q.id+'" data-grade="yes"','softBtn')+button(result.grades[q.id]===false?'✓ Öva mer':'🔁 Behöver öva mer','examGrade','data-id="'+q.id+'" data-grade="no"','secondary')+'</div></article>').join("")+'</section>'+
 '<section class="surface"><details '+(wrong.length?'open':'')+'><summary>Del 1: Visa rättning av faktafrågorna ('+(result.total-wrong.length)+' rätt, '+wrong.length+' fel)</summary><div class="reviewList">'+EXAM_CLOSED.map((q,i)=>{const right=result.answers[q.id]===expected(q);return '<div class="reviewItem '+(right?"isRight":"isWrong")+'"><b>'+(right?'✓ ':'↪ ')+(i+1)+'. '+esc(prompt(q))+'</b><p>Ditt svar: '+esc(result.answers[q.id]===undefined?'Inget svar':choices(q)[result.answers[q.id]])+'</p><p>Rätt svar: '+esc(choices(q)[expected(q)])+'</p><p>'+esc(q.why)+'</p></div>';}).join("")+'</div></details></section>');
}
function reviewWrong(){
 const all=[...DJUR.quiz,...DJUR.trueFalse].filter(q=>saved.bad.includes(q.id));
 if(!all.length){go("home");return;}
 practice={kind:"review",items:shuffle(all),index:0,picked:null,revealed:false,responses:[],title:"Öva dina missar"};
 mode="quiz";nav.querySelectorAll("[data-nav]").forEach(b=>{const on=b.dataset.nav==="quiz";b.classList.toggle("active",on);b.setAttribute("aria-current",on?"page":"false");});renderPractice();scrollPanel();
}
function action(btn){
 const a=btn.dataset.action;
 if(a==="homeAction"){go("home");return;}
 if(a==="topic"){go("study",{topic:btn.dataset.topic});return;}
 if(a==="prevTopic"){lesson=Math.max(0,lesson-1);renderStudy();scrollPanel();return;}
 if(a==="nextTopic"){if(lesson===DJUR.topics.length-1)go("home");else{lesson++;renderStudy();scrollPanel();}return;}
 if(a==="readTopic"||a==="unreadTopic"){const id=DJUR.topics[lesson].id;saved.studied=a==="readTopic"?unique([...saved.studied,id]):saved.studied.filter(x=>x!==id);store();renderStudy();return;}
 if(a==="cardsRestart"){cards=null;go("cards",{restart:true});return;}
 if(a==="flipCard"){cards.flipped=!cards.flipped;renderCards();return;}
 if(a==="cardGood"||a==="cardWeak"){const id=cards.items[cards.index].id;if(a==="cardGood"){cards.ok++;saved.cardWeak=saved.cardWeak.filter(x=>x!==id);}else{saved.cardWeak=unique([...saved.cardWeak,id]);}cards.index++;cards.flipped=false;store();renderCards();return;}
 if(a==="practicePick"){if(practice.revealed)return;practice.picked=Number(btn.dataset.option);renderPractice();return;}
 if(a==="practiceCheck"){if(practice.picked===null)return;const q=practice.items[practice.index],correct=practice.picked===expected(q);practice.responses.push({id:q.id,selected:practice.picked,correct});markBad(q.id,!correct);practice.revealed=true;renderPractice();return;}
 if(a==="practiceNext"){practice.index++;practice.picked=null;practice.revealed=false;if(practice.index===practice.items.length){renderPracticeDone();}else renderPractice();scrollPanel();return;}
 if(a==="practiceRestart"){if(practice&&practice.kind==="review"){reviewWrong();return;}go(practice.kind,{restart:true});return;}
 if(a==="review"){reviewWrong();return;}
 if(a==="matchRestart"){go("match",{restart:true});return;}
 if(a==="matchPick"){if(match.matched.includes(btn.dataset.id))return;const side=btn.dataset.side,id=btn.dataset.id;match[side==="left"?"leftPick":"rightPick"]=id;
 if(match.leftPick&&match.rightPick){if(match.leftPick===match.rightPick){match.matched.push(id);match.message="✓ Rätt! "+match.items.find(x=>x.id===id).term+" är rätt matchat.";}else{match.mistakes++;match.message="↪ Inte riktigt! Prova ett annat par.";}match.leftPick=null;match.rightPick=null;}renderMatch();return;}
 if(a==="essayReveal"){essayReveal=!essayReveal;renderEssay();return;}
 if(a==="essayGood"||a==="essayWeak"){const q=DJUR.open[essay];saved.essayRatings[q.id]=a==="essayGood"?"ok":"retry";store();renderEssay();return;}
 if(a==="essayPrev"||a==="essayNext"){essay=(essay+(a==="essayPrev"?-1:1)+DJUR.open.length)%DJUR.open.length;essayReveal=false;renderEssay();scrollPanel();return;}
 if(a==="examStart"){startExam();return;}
 if(a==="examShowResult"){examStage="result";renderExamResult();scrollPanel();return;}
 if(a==="examPick"){const q=EXAM_ITEMS[saved.examDraft.index];saved.examDraft.answers[q.id]=Number(btn.dataset.option);store();renderExamQuestion();return;}
 if(a==="examPrev"||a==="examNext"){const d=saved.examDraft;d.index=Math.max(0,Math.min(EXAM_ITEMS.length-1,d.index+(a==="examPrev"?-1:1)));store();renderExamQuestion();scrollPanel();return;}
 if(a==="examFinish"){finishExam();return;}
 if(a==="examGrade"){saved.lastExam.grades[btn.dataset.id]=btn.dataset.grade==="yes";store();renderExamResult();return;}
}
document.addEventListener("click",e=>{
 const navBtn=e.target.closest("[data-nav]");if(navBtn){go(navBtn.dataset.nav);return;}
 const b=e.target.closest("[data-action]");if(b&&!b.disabled){action(b);}
});
document.addEventListener("input",e=>{
 if(e.target.id==="essayAnswer"){saved.essayDrafts[DJUR.open[essay].id]=e.target.value;store();}
 if(e.target.id==="examText"&&saved.examDraft){const q=EXAM_ITEMS[saved.examDraft.index];if(q&&q.id.startsWith("o")){saved.examDraft.essays[q.id]=e.target.value;store();}}
});
go("home",{noScroll:true});
})();