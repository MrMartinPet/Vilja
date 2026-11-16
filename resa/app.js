(function(){
"use strict";
var PLAN_FILE="plan.json", LOCAL_KEY="vilja-philippines-2027-local-v1";
var data=null, published=null, map=null, markerLayer=null, routeLayer=null, taskFilter="open", activityFilter="Alla", modalSave=null, toastTimer=null, activeView="overview";
var byId=function(id){return document.getElementById(id);};
var clone=function(o){return JSON.parse(JSON.stringify(o));};
var esc=function(x){return String(x===null||x===undefined?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var safeUrl=function(u){try{var url=new URL(u,location.href);return /^https?:$/.test(url.protocol)?url.href:"";}catch(e){return "";}};
var money=function(x){return typeof x==="number" && Number.isFinite(x)?new Intl.NumberFormat("sv-SE",{maximumFractionDigits:0}).format(x)+" kr":"–";};
var num=function(x){return x===null||x===undefined||x===""?null:Number(x);};
var dateLabel=function(s){var d=new Date(s.slice(0,10)+"T12:00:00Z");return new Intl.DateTimeFormat("sv-SE",{day:"numeric",month:"short",timeZone:"UTC"}).format(d);};
var statusName={booked:"Bokat",paid:"Betalt",selected:"Valt · ej bokat",todo:"Ej bokat",decision:"Beslut kvar"};
var iconName={"flyg":"✈️","hotell":"🏨","bil":"🚐","båt":"⛴️","val":"⚖️","tåg":"🚆","buss":"🚌"};
var stayIcon={"villa":"🌴","hotell":"🛏️"};
function badge(status){return '<span class="status '+esc(status||"todo")+'">'+esc(statusName[status]||"Ej bokat")+'</span>';}
function link(url,title,css){return safeUrl(url)?'<a class="'+(css||"")+'" target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(url))+'">'+esc(title)+' ↗</a>':"";}
function notice(msg,type){var el=byId(type==="error"?"errorBanner":"syncBanner");el.textContent=msg;el.hidden=false;}
function toast(msg){var el=byId("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove("show");},3000);}
function locallySaved(){try{var s=localStorage.getItem(LOCAL_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
function save(redraw){
 if(!data)return;
 try{localStorage.setItem(LOCAL_KEY,JSON.stringify({version:published?published.version:data.version,updated:new Date().toISOString(),plan:data}));byId("dataState").textContent="Sparat på din enhet";}catch(e){toast("Kunde inte spara lokalt. Exportera planen som backup.");}
 if(redraw!==false)render();
}
function freshness(){
 var now=new Date(), departure=new Date("2027-02-08T00:00:00");
 var days=Math.ceil((departure.getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/86400000);
 byId("daysLeft").textContent=days>=0?days:"Pågår";
 byId("lastUpdated").textContent="Publicerad plan: "+(published?published.updated:"–")+" · Ändringar på denna enhet synkas inte automatiskt";
}
function renderStats(){
 var tasks=data.tasks||[],decisions=data.decisions||[],left=tasks.filter(function(t){return !t.done;}).length;
 byId("tasksOpen").textContent=left;
 byId("tasksDone").textContent=(tasks.length-left)+" klara av "+tasks.length;
 byId("decisionsOpen").textContent=decisions.filter(function(d){return !d.choice;}).length;
 var top=tasks.filter(function(t){return !t.done&&t.priority==="high";}).slice(0,4);
 if(!top.length)top=tasks.filter(function(t){return !t.done;}).slice(0,4);
 byId("priorityTasks").innerHTML=top.length?top.map(function(t,i){return '<div class="priority-row"><span class="no">'+(i+1)+'</span><span>'+esc(t.title)+'</span></div>';}).join(""):'<p>Alla uppgifter avklarade. Bra jobbat!</p>';
}
function renderStays(){
 var list=data.stays||[];
 byId("stayGrid").innerHTML=list.map(function(stay){
  var b=stay.booking||null, booked=stay.status==="booked"||stay.status==="paid";
  var stayBody='<article class="stay-card'+(booked?' stay-card-booked':'')+'"><div class="stay-graphic"><span>'+esc(stayIcon[stay.kind]||"🏝️")+'</span><b>'+esc(stay.nights)+' natt'+(stay.nights===1?"":"er")+'</b></div>'+
   '<div>'+badge(stay.status)+'</div><h3>'+esc(stay.place)+'</h3>'+
   '<p>'+esc(dateLabel(stay.from))+'–'+esc(dateLabel(stay.to))+' · '+esc(stay.area)+'</p>'+
   '<p>'+esc(stay.suggestion||"")+'</p>';
  if(b&&b.confirmed){
   stayBody+='<div class="stay-booked-info">'+
     '<strong>✓ Bekräftad hotellbokning</strong>'+
     '<div class="stay-booked-row">🛏️ '+esc(b.roomCount)+' rum · '+esc(b.roomType)+'</div>'+
     '<div class="stay-booked-row">👨‍👩‍👧‍👦 '+esc(b.adults)+' vuxna och '+esc((b.childrenCount!=null?b.childrenCount:(b.childrenAgesOnBooking||[]).length))+' barn · 6 nätter</div>'+
     '<div class="stay-booked-row">🕒 Incheckning från '+esc(b.checkInFrom)+' · utcheckning före '+esc(b.checkOutBefore)+'</div>'+
     '<div class="stay-booked-row">☕ Inkluderat: '+esc((b.included||[]).join(", "))+'</div>'+
     '<div class="stay-booked-row">🏝️ Direkt poolaccess, markplan och White Beach vid hotellet</div>'+
     '<div class="stay-booked-note">Badrumsfråga kvar: det är ännu inte bekräftat om sviten har två badrum.</div>'+
     '</div>';
  }
  stayBody+=(stay.alternatives&&stay.alternatives.length&&!booked?'<div class="stay-alternatives"><strong>Boenden att jämföra</strong>'+stay.alternatives.map(function(a){return '<div class="stay-alt"><div>'+link(a.url,a.name)+'</div><small>'+esc(a.status||"Ej bokat")+'</small><p>'+esc(a.details||"")+'</p></div>';}).join("")+'</div>':"");
  stayBody+='<div class="stay-footer">'+link(stay.link,booked?"Visa bokade sviten":"Sök boende")+'<button class="edit-icon" data-edit="stay" data-id="'+esc(stay.id)+'">Ändra</button></div></article>';
  return stayBody;
 }).join("");
}
function renderDomesticBaggage(){
 var host=byId("confirmedDomesticPanel");if(!host)return;
 var b=data.domesticBaggage||(published&&published.domesticBaggage);
 if(!b||!Array.isArray(b.byFlight)){host.hidden=true;return;}
 var flights=b.byFlight.map(function(bag){
  var l=(data.legs||[]).find(function(f){return f.id===bag.id;})||{};
  return '<article class="domestic-flight-card'+(bag.checked.perPieceKg===10?' tight-baggage':'')+'">'+
    '<div class="domestic-flight-head"><div><strong>'+esc(bag.route)+'</strong><small>'+esc(dateLabel(bag.date))+' · '+esc(bag.carrier)+' '+esc(bag.flightNumber)+'</small></div><b>'+esc(l.time||"")+'</b></div>'+
    '<div class="domestic-flight-bags">'+
      '<div><span>🎒 Handbagage</span><b>'+esc(bag.cabin.pieces)+' × '+esc(bag.cabin.perPassengerKg)+' kg</b><small>'+esc(bag.cabin.dimensionsCm.join(" × "))+' cm</small></div>'+
      '<div><span>🧳 Incheckat totalt</span><b>'+esc(bag.checked.pieces)+' × '+esc(bag.checked.perPieceKg)+' kg</b><small>'+esc(bag.checked.dimensionsCm.join(" × "))+' cm</small></div>'+
      (bag.personal?'<div><span>👜 Personligt föremål</span><b>'+esc(bag.personal.pieces)+' × '+esc(bag.personal.perPassengerKg)+' kg</b><small>'+esc(bag.personal.dimensionsCm.join(" × "))+' cm · enligt återförsäljarens översikt</small></div>':'')+
    '</div>'+
    (bag.checked.perPieceKg===10?'<div class="domestic-flight-caution">Viktgräns på detta flyg: endast 10 kg per incheckad väska!</div>':'')+
  '</article>';
 }).join("");
 host.hidden=false;
 host.innerHTML='<div class="booked-trips-heading"><span class="booked-trips-tick">✓</span><div><h3>Alla tre inrikesflyg bokade</h3><p>'+esc(b.passengers)+' resenärer · bagage enligt bokningsöversikterna</p></div></div>'+
   '<div class="domestic-flights-list">'+flights+'</div>'+
   '<p class="booked-trips-warning"><strong>Viktigt:</strong> På Cebu → Caticlan gäller 2 × 10 kg incheckat, men på de övriga två flygen 2 × 20 kg. Packa inte mer än 10 kg per incheckad väska under hela resan utan att först köpa till mer bagage för 17 februari. Den planerade OceanJet-färjan har normalt 10 kg per person i turistklass.</p>'+
   '<div class="domestic-intl-note"><strong>Flygen Sverige ↔ Manila (Air China)</strong><p>I Economy är handbagagets normalgräns 5 kg (55 × 40 × 20 cm). Normalt ingår minst 1 incheckad väska à 23 kg; exakt antal beror på biljettyp och ska kontrolleras i Air China-biljetten. Reglerna är alltså inte samma som på inrikesflygen.</p><a href="https://ru.airchina.com/JP/GB/info/carry-on-baggage/" target="_blank" rel="noopener">Air Chinas handbagageregler ↗</a></div>';
}
function renderLegs(){
 var legs=data.legs||[];
 byId("legList").innerHTML=legs.map(function(l){
   return '<article class="leg-item"><div class="leg-date">'+esc(dateLabel(l.date))+'</div><div class="leg-icon" aria-hidden="true">'+esc(iconName[l.type]||"📍")+'</div>'+
    '<div class="leg-copy"><strong>'+esc(l.title)+'</strong><small>'+esc(l.route)+' · '+esc(l.time)+'</small>'+
    '<p>'+esc(l.duration)+' · '+esc(l.details||"")+'</p></div><div class="leg-actions">'+badge(l.status)+link(l.url,"Biljetter")+
    '<button class="edit-icon" type="button" data-edit="leg" data-id="'+esc(l.id)+'">Ändra</button></div></article>';
 }).join("");
}
function renderTasks(){
 var tasks=data.tasks||[],done=tasks.filter(function(t){return t.done;}).length,pct=tasks.length?Math.round(done/tasks.length*100):100;
 byId("taskProgressLabel").textContent=pct+" % klart";
 byId("taskProgressCaption").textContent=done+" / "+tasks.length;
 byId("taskProgressBar").style.width=pct+"%";
 var filtered=tasks.filter(function(t){return taskFilter==="all"||(taskFilter==="open"&&!t.done)||(taskFilter==="done"&&t.done);});
 byId("taskList").innerHTML=filtered.length?filtered.map(function(t){
  return '<div class="task-row '+(t.done?"is-done":"")+'"><input type="checkbox" data-task="'+esc(t.id)+'" aria-label="Markera uppgift klar" '+(t.done?"checked":"")+'>'+
    '<div class="task-content"><b>'+esc(t.title)+'</b><small>'+esc(t.note||"")+'</small></div>'+
    '<div class="task-side"><span class="category-pill '+esc(t.priority)+'">'+esc(t.category)+'</span><button class="edit-icon" data-edit="task" data-id="'+esc(t.id)+'">Ändra</button></div></div>';
 }).join(""):'<p class="subtle">Inga uppgifter i den här vyn.</p>';
 Array.from(byId("taskFilters").querySelectorAll("button")).forEach(function(b){b.classList.toggle("active",b.dataset.filter===taskFilter);});
}
function renderDecisions(){
 var open=(data.decisions||[]).filter(function(d){return !d.choice;});
 byId("decisionsGrid").innerHTML=open.map(function(d){
   return '<article class="pending-decision"><div class="pending-decision-text"><strong>'+esc(d.title)+'</strong><p>'+esc(d.note||d.why||"")+'</p></div><button type="button" class="edit-icon" data-edit="decision" data-id="'+esc(d.id)+'">Ändra</button></article>';
 }).join("") || '<p class="subtle">Inga öppna beslut just nu.</p>';
}
function showView(view){
 var allowed=["overview","plan","tasks","costs","details"];
 if(allowed.indexOf(view)<0)view="overview";
 activeView=view;
 document.body.setAttribute("data-active-view",view);
 Array.from(document.querySelectorAll("[data-view-button]")).forEach(function(b){
   var on=b.getAttribute("data-view-button")===view;
   b.classList.toggle("active",on);
   if(on)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
 });
 if(view==="details"&&map&&typeof map.invalidateSize==="function")setTimeout(function(){map.invalidateSize();},80);
 window.scrollTo({top:0,behavior:"instant"});
}
function renderCostOverview(){
 var rows=(published&&published.publicCostOverview)||data.publicCostOverview||[];
 var fmt=function(n){return Number.isFinite(n)?new Intl.NumberFormat("sv-SE",{minimumFractionDigits:0,maximumFractionDigits:2}).format(n)+" kr":"Pris saknas";};
 var five=rows.filter(function(x){return x.amountSEK!==null&&x.scope==="Familjen, 5 personer";}).reduce(function(a,x){return a+x.amountSEK;},0);
 var seven=rows.filter(function(x){return x.amountSEK!==null&&x.scope==="Alla 7 personer";}).reduce(function(a,x){return a+x.amountSEK;},0);
 byId("familyCostTotal").textContent=fmt(five);
 byId("groupCostTotal").textContent=fmt(seven);
 byId("costOverviewList").innerHTML=rows.map(function(x){
  var unknown=x.amountSEK===null;
  var state=x.status==="paid"?"Betalt":x.status==="booked"?"Bokat":"Ej bokat";
  return '<div class="cost-line"><div class="cost-line-name"><strong>'+esc(x.name)+'</strong><small>'+esc(x.scope)+' · '+esc(state)+'</small></div><b class="'+(unknown?'cost-unknown':'')+'">'+esc(fmt(x.amountSEK))+'</b></div>';
 }).join("");
}
function renderBudget(){
 var rows=data.budget||[];
 var totals=rows.filter(function(x){return Number.isFinite(x.totalSEK);}).map(function(x){return x.totalSEK;});
 var paid=rows.filter(function(x){return Number.isFinite(x.paidSEK);}).map(function(x){return x.paidSEK;});
 byId("budgetTotal").textContent=totals.length?money(totals.reduce(function(a,b){return a+b;},0)):"Ej ifyllt";
 byId("budgetPaid").textContent=paid.length?money(paid.reduce(function(a,b){return a+b;},0)):"Ej ifyllt";
 byId("budgetRows").innerHTML=rows.map(function(b){
  return '<tr><td>'+esc(b.name)+'</td><td>'+badge(b.status)+'</td><td class="numeric">'+money(b.totalSEK)+'</td><td class="numeric">'+money(b.paidSEK)+'</td><td><button class="edit-icon" data-edit="budget" data-id="'+esc(b.id)+'">Ändra</button></td></tr>';
 }).join("");
 var quotes=(data.quotes||[]);
 var qel=byId("quoteList");
 if(qel){
  qel.innerHTML=quotes.map(function(q){return '<article class="quote-card"><small>'+esc(q.leg)+' · '+esc(q.people)+' personer</small><b>'+money(q.amount)+'</b><p>'+esc(q.note)+'</p></article>';}).join("");
  var qpanel=qel.closest(".quotes-panel");if(qpanel)qpanel.hidden=!quotes.length;
 }
}
function renderActivities(){
 var rows=(data.activities||[]).filter(function(a){return activityFilter==="Alla"||a.island===activityFilter;});
 byId("activityGrid").innerHTML=rows.map(function(a){
  var url="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(a.location);
  return '<article class="activity-card"><div class="activity-head"><span class="activity-emoji">'+esc(a.icon)+'</span><span class="section-tag '+(a.priority==="måste"?"":"amber")+'">'+esc(a.priority)+" · "+esc(a.island)+'</span></div>'+
   '<h3>'+esc(a.title)+'</h3><p>'+esc(a.desc)+'</p><div class="activity-meta"><small>'+esc(a.duration)+'</small>'+link(url,"Visa plats")+'</div></article>';
 }).join("");
 Array.from(byId("activityFilters").querySelectorAll("button")).forEach(function(b){b.classList.toggle("active",b.dataset.island===activityFilter);});
}
function render(){
 if(!data)return;
 renderStats();renderStays();renderLegs();renderDomesticBaggage();renderTasks();renderDecisions();renderBudget();renderCostOverview();renderActivities();freshness();
 var preference=byId("stayPreferenceDisplay");if(preference)preference.textContent=data.stayPreference||(published&&published.stayPreference)||"Rymlig villa eller rum i markplan nära pool, strand och restauranger för alla sju.";
 if(document.activeElement!==byId("familyNotes"))byId("familyNotes").value=data.notes||"";
 if(map)drawMap();
}
function elementField(name,label,value,type,opts){
 var id="f-"+name;var content="";
 if(type==="textarea")content='<textarea id="'+id+'" name="'+name+'">'+esc(value||"")+'</textarea>';
 else if(type==="select")content='<select id="'+id+'" name="'+name+'">'+(opts||[]).map(function(o){return '<option value="'+esc(o.value)+'" '+(String(o.value)===String(value)?"selected":"")+'>'+esc(o.label)+'</option>';}).join("")+'</select>';
 else content='<input id="'+id+'" name="'+name+'" type="'+esc(type||"text")+'" value="'+esc(value===null||value===undefined?"":value)+'" '+(type==="number"?'step="1" min="0"':"")+' />';
 return '<label class="form-field" for="'+id+'"><span>'+esc(label)+'</span>'+content+'</label>';
}
function statusOptions(){
 return [{value:"todo",label:"Ej bokat"},{value:"selected",label:"Valt · ej bokat"},{value:"decision",label:"Beslut kvar"},{value:"booked",label:"Bokat"},{value:"paid",label:"Betalt"}];
}
function openModal(kind,id){
 if(!data)return;
 var arrKey=kind==="stay"?"stays":kind==="leg"?"legs":kind==="task"?"tasks":kind==="decision"?"decisions":"budget";
 var arr=data[arrKey], item=id?arr.find(function(x){return x.id===id;}):null;
 if(id&&!item)return;
 var fields="",title="";
 if(kind==="task"){
  title=id?"Redigera uppgift":"Ny uppgift";
  fields+=elementField("title","Uppgift",item?item.title:"","text");
  fields+=elementField("category","Kategori",item?item.category:"Övrigt","select",["Flyg","Boende","Transport","Beslut","Budget","Aktivitet","Dokument","Övrigt"].map(function(v){return {value:v,label:v};}));
  fields+=elementField("priority","Prioritet",item?item.priority:"medium","select",[{value:"high",label:"Hög"},{value:"medium",label:"Normal"},{value:"low",label:"Låg"}]);
  fields+=elementField("note","Anteckning",item?item.note:"","textarea");
 }else if(kind==="budget"){
  title=id?"Redigera kostnad":"Lägg till kostnad";
  fields+=elementField("name","Kostnadspost",item?item.name:"","text");
  fields+=elementField("category","Kategori",item?item.category:"Övrigt","select",["Flyg","Boende","Transport","Aktiviteter","Övrigt"].map(function(v){return {value:v,label:v};}));
  fields+=elementField("totalSEK","Total kostnad SEK för hela sällskapet (7)",item?item.totalSEK:"","number");
  fields+=elementField("paidSEK","Betalt hittills SEK",item?item.paidSEK:"","number");
  fields+=elementField("status","Bokningsstatus",item?item.status:"todo","select",statusOptions());
 }else if(kind==="decision"){
  title="Redigera beslut";
  fields+=elementField("title","Rubrik",item.title,"text");
  fields+=elementField("note","Anteckning",item.note||"","textarea");
  fields+=elementField("why","Vad avgör beslutet?",item.why||"","textarea");
 }else if(kind==="leg"){
  title="Uppdatera transport";
  fields+=elementField("title","Transport",item.title,"text");
  fields+=elementField("time","Tid",item.time,"text");
  fields+=elementField("status","Status",item.status,"select",statusOptions());
  fields+=elementField("details","Detaljer / bokningsläge",item.details||"","textarea");
  fields+=elementField("url","Länk till biljett / leverantör (inte privat bokningslänk)",item.url||"","text");
 }else if(kind==="stay"){
  title="Uppdatera boende";
  fields+=elementField("status","Status",item.status,"select",statusOptions());
  fields+=elementField("suggestion","Valt hotell/hus eller att leta efter",item.suggestion||"","text");
  fields+=elementField("area","Område",item.area||"","text");
  fields+=elementField("details","Detaljer",item.details||"","textarea");
  fields+=elementField("link","Offentlig boendelänk (inte privat bokningsreferens)",item.link||"","text");
 }
 byId("editorTitle").textContent=title;
 byId("editorFields").innerHTML=fields;
 modalSave=function(){
  var f=new FormData(byId("editorForm"));var target=item;
  if(!target){target={id:kind.slice(0,1)+"-"+Date.now()};arr.push(target);}
  if(kind==="task"){
    target.title=String(f.get("title")||"").trim();if(!target.title){toast("Skriv en uppgift.");return false;}
    target.category=String(f.get("category")||"Övrigt");
    target.priority=String(f.get("priority")||"medium");
    target.note=String(f.get("note")||"");if(!id)target.done=false;
  }else if(kind==="budget"){
    target.name=String(f.get("name")||"").trim();if(!target.name){toast("Skriv en kostnadspost.");return false;}
    target.category=String(f.get("category")||"Övrigt");
    target.totalSEK=num(f.get("totalSEK"));target.paidSEK=num(f.get("paidSEK"));
    if([target.totalSEK,target.paidSEK].some(function(x){return x!==null&&(!Number.isFinite(x)||x<0)})){toast("Beloppen måste vara giltiga.");return false;}
    target.status=String(f.get("status")||"todo");target.scope="7 personer";
  }else if(kind==="decision"){
    target.title=String(f.get("title")||target.title);target.note=String(f.get("note")||"");target.why=String(f.get("why")||"");
  }else if(kind==="leg"){
    target.title=String(f.get("title")||target.title);target.time=String(f.get("time")||"");
    target.status=String(f.get("status")||"todo");target.details=String(f.get("details")||"");
    target.url=safeUrl(String(f.get("url")||""));
  }else if(kind==="stay"){
    target.status=String(f.get("status")||"todo");target.suggestion=String(f.get("suggestion")||"");
    target.area=String(f.get("area")||"");target.details=String(f.get("details")||"");
    target.link=safeUrl(String(f.get("link")||""));
  }
  save(true);toast("Ändrat och sparat på den här enheten.");return true;
 };
 byId("editDialog").showModal();
 var first=byId("editorFields").querySelector("input,select,textarea");if(first)first.focus();
}
function downloadPlan(){
 var payload=JSON.stringify(data,null,2)+"\n",blob=new Blob([payload],{type:"application/json"});
 var url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="filippinerna-2027-plan.json";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},500);
 toast("Planen har exporterats. Dela filen för att synka med andra.");
}
function reportText(){
 var result={
   uppmaning:"Uppdatera reseplanen i GitHub-repot MrMartinPet/Vilja, filen resa/plan.json, med följande lokala ändringar.",
   version:data.version,
   anteckningar:data.notes||"",
   uppgifter:data.tasks,
   beslut:data.decisions,
   boenden:data.stays,
   transporter:data.legs,
   kostnader:data.budget
 };
 return JSON.stringify(result,null,2);
}
function fallbackCopy(str){
 var area=document.createElement("textarea");area.value=str;area.style.position="fixed";area.style.top="-1000px";document.body.appendChild(area);area.select();var ok=document.execCommand("copy");area.remove();return ok;
}
async function copyReport(){
 var str=reportText();
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(str);}else if(!fallbackCopy(str))throw new Error("clipboard");toast("Uppdateringen kopierad. Klistra in i ChatGPT.");}
 catch(e){downloadPlan();toast("Kunde inte kopiera. En planfil laddades ned i stället.");}
}
function importPlan(file){
 if(!file)return;
 var reader=new FileReader();
 reader.onload=function(){
  try{var imported=JSON.parse(String(reader.result));if(!imported||!Array.isArray(imported.tasks)||!Array.isArray(imported.stays)||!Array.isArray(imported.budget)||!Array.isArray(imported.legs))throw new Error("invalid");
   if(!confirm("Importera planen från filen? Dina nuvarande lokala ändringar ersätts."))return;
   data=imported;save(true);toast("Planen importerad och sparad på den här enheten.");}
  catch(e){toast("Filen är inte en giltig reseplan.");}
 };
 reader.readAsText(file,"utf-8");
}
function mapIcon(kind){
 var c=kind==="flyg"?"#0c7391":kind==="boende"?"#cf8665":kind==="aktivitet"?"#be9d3c":"#417e7b";
 return window.L.divIcon({className:"",iconSize:[24,24],iconAnchor:[12,12],html:'<span style="display:block;background:'+c+';width:23px;height:23px;border:3px solid white;border-radius:100%;box-shadow:0 2px 8px #173c4160"></span>'});
}
function drawMap(){
 if(!map||!window.L)return;
 if(markerLayer)markerLayer.remove();
 if(routeLayer)routeLayer.remove();
 markerLayer=window.L.layerGroup().addTo(map);routeLayer=window.L.layerGroup().addTo(map);
 var index={};
 (data.places||[]).forEach(function(p){index[p.id]=p;var url="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.name+", Philippines");
  window.L.marker([p.lat,p.long],{icon:mapIcon(p.kind)}).addTo(markerLayer)
    .bindPopup('<strong>'+esc(p.name)+'</strong><br>'+esc(p.description||"")+'<br><a href="'+url+'" target="_blank" rel="noopener">Öppna i Google Maps ↗</a>');
 });
 function line(ids,color){var pts=ids.map(function(id){return index[id]?[index[id].lat,index[id].long]:null;}).filter(Boolean);if(pts.length>1)window.L.polyline(pts,{color:color,opacity:.75,weight:3,dashArray:"6 7"}).addTo(routeLayer);}
 line(["mnl","tag"],"#08a09b");line(["alona","tagport"],"#d49b68");line(["tagport","cebport"],"#1590ad");line(["cebport","ceb"],"#d49b68");line(["ceb","mph"],"#08a09b");line(["mph","caticlanport","cagban","twoseasons"],"#d49b68");line(["mph","mnl"],"#08a09b");
}
function mapScope(scope){
 if(!map||!window.L)return;
 var ids=scope==="Bohol"?["alona","tag","loboc","balicasag","pamilacan","tagport","chocolate"]:scope==="Boracay"?["mph","caticlanport","cagban","twoseasons","white","nabaoy","carabao"]:["mnl","alona","ceb","mph","twoseasons"];
 var pts=(data.places||[]).filter(function(p){return ids.indexOf(p.id)>-1;}).map(function(p){return [p.lat,p.long];});
 if(pts.length)map.fitBounds(window.L.latLngBounds(pts).pad(.24),{animate:true,maxZoom:scope==="Alla"?7:11});
 ["mapAll","mapBohol","mapBoracay"].forEach(function(k){byId(k).classList.toggle("active",k===(scope==="Bohol"?"mapBohol":scope==="Boracay"?"mapBoracay":"mapAll"));});
}
function setupMap(){
 if(!window.L){byId("map").innerHTML='<div class="map-fallback">Den interaktiva kartan kräver internet. Använd länken ”Öppna Google Maps” ovan.</div>';return;}
 try{map=window.L.map("map",{scrollWheelZoom:false}).setView([10.9,122],7);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
  drawMap();mapScope("Alla");
  document.querySelectorAll('a[href="#karta"]').forEach(function(a){a.addEventListener("click",function(){setTimeout(function(){map.invalidateSize();mapScope("Alla");},170);});});
 }catch(e){byId("map").innerHTML='<div class="map-fallback">Kartan kunde inte laddas just nu. Klicka ”Öppna Google Maps”.</div>';}
}
function bind(){
 document.addEventListener("click",function(e){
  var viewButton=e.target.closest("[data-view-button],[data-go-view]");
  if(viewButton){showView(viewButton.getAttribute("data-view-button")||viewButton.getAttribute("data-go-view"));return;}

  var button=e.target.closest("[data-edit]");if(button){openModal(button.dataset.edit,button.dataset.id);return;}
  var filter=e.target.closest("[data-filter]");if(filter){taskFilter=filter.dataset.filter;renderTasks();return;}
  var island=e.target.closest("[data-island]");if(island){activityFilter=island.dataset.island;renderActivities();return;}
 });
 document.addEventListener("change",function(e){
  if(e.target.dataset.task){var item=(data.tasks||[]).find(function(t){return t.id===e.target.dataset.task;});if(item){item.done=!!e.target.checked;save(true);}return;}
  if(e.target.dataset.decision){var d=(data.decisions||[]).find(function(x){return x.id===e.target.dataset.decision;});if(d){d.choice=e.target.value;save(true);toast("Beslutet sparat på den här enheten.");}}
 });
 byId("openEditor").addEventListener("click",function(){showView("details");document.getElementById("anteckningar").scrollIntoView({behavior:"smooth"});});
 byId("addTaskTop").addEventListener("click",function(){openModal("task");});
 byId("addBudget").addEventListener("click",function(){openModal("budget");});
 byId("editorForm").addEventListener("submit",function(e){e.preventDefault();if(modalSave&&modalSave())byId("editDialog").close();});
 byId("closeDialog").addEventListener("click",function(){byId("editDialog").close();});
 byId("cancelDialog").addEventListener("click",function(){byId("editDialog").close();});
 byId("familyNotes").addEventListener("input",function(e){if(data){data.notes=e.target.value;save(false);}});
 byId("copyReport").addEventListener("click",copyReport);
 byId("exportPlan").addEventListener("click",downloadPlan);
 byId("importPlan").addEventListener("change",function(e){importPlan(e.target.files[0]);e.target.value="";});
 byId("resetPlan").addEventListener("click",function(){if(!published)return; if(!confirm("Återställa till senaste publicerade GitHub-planen? Exportera först om du vill spara lokala ändringar."))return; data=clone(published);try{localStorage.removeItem(LOCAL_KEY);}catch(e){}byId("syncBanner").hidden=true;render();toast("Senaste publicerade planen är återställd.");});
 byId("mapAll").addEventListener("click",function(){mapScope("Alla");});
 byId("mapBohol").addEventListener("click",function(){mapScope("Bohol");});
 byId("mapBoracay").addEventListener("click",function(){mapScope("Boracay");});
 var links=Array.from(document.querySelectorAll(".section-nav a"));
 links.forEach(function(a){a.addEventListener("click",function(){links.forEach(function(x){x.classList.toggle("active",x===a);});});});
}
async function init(){
 bind();
 try{
  var res=await fetch(PLAN_FILE,{cache:"no-store"});
  if(!res.ok)throw new Error("HTTP "+res.status);
  published=await res.json();
  if(!published||!Array.isArray(published.tasks))throw new Error("Dataformat");
  var local=locallySaved();
  if(local&&local.plan){
    data=local.plan;
    // Always show newly published accommodation candidates without overwriting
    // this device's private task, budget or booking-status changes.
    (published.stays||[]).forEach(function(masterStay){
      var localStay=(data.stays||[]).find(function(s){return s.id===masterStay.id;});
      if(!localStay)return;
      var alternatives=localStay.alternatives||[];
      (masterStay.alternatives||[]).forEach(function(option){
        if(!alternatives.some(function(a){return a.id===option.id;}))alternatives.push(clone(option));
      });
      localStay.alternatives=alternatives;
      // Hotel reservations recorded on GitHub supersede older local choices.
      if(masterStay.booking&&masterStay.booking.confirmed){
        Object.assign(localStay,clone(masterStay));
        if(!masterStay.alternatives)delete localStay.alternatives;
      }
    });
    // Reconcile newly confirmed travel details with older private on-device copies.
    ["flight-mnl-tag","flight-mph-mnl","return-from-island","last-hotel-checkin","cebu-air","bohol-boracay","hotel-first-checkin"].forEach(function(id){
      var masterLeg=(published.legs||[]).find(function(l){return l.id===id;});
      var localLeg=(data.legs||[]).find(function(l){return l.id===id;});
      if(masterLeg&&localLeg)Object.assign(localLeg,clone(masterLeg));
    });
    // New train and bus segments must appear on previously saved phones as well.
    ["train-out","bus-out","bus-return","train-return"].forEach(function(id){
      var masterLeg=(published.legs||[]).find(function(l){return l.id===id;});
      if(!masterLeg)return;
      data.legs=data.legs||[];
      var localLeg=data.legs.find(function(l){return l.id===id;});
      if(localLeg)Object.assign(localLeg,clone(masterLeg));
      else if(id==="train-out"||id==="bus-out")data.legs.unshift(clone(masterLeg));
      else data.legs.push(clone(masterLeg));
    });
    // Preserve correct chronological order on devices with old locally saved plans.
    var sortKey=function(l){
      var d=l.date||"9999";
      if(l.id==="train-out")return d+"-00";
      if(l.id==="bus-out")return d+"-01";
      if(l.id==="bus-return")return d+"-90";
      if(l.id==="train-return")return d+"-91";
      return d+"-40";
    };
    data.legs.sort(function(a,b){return sortKey(a).localeCompare(sortKey(b));});
    ["t01","t02","t03","t04","t05","t07","t09","t10","t22","t23","t24"].forEach(function(id){
      var masterTask=(published.tasks||[]).find(function(t){return t.id===id;});
      var localTask=(data.tasks||[]).find(function(t){return t.id===id;});
      if(masterTask&&localTask)Object.assign(localTask,clone(masterTask));
      else if(masterTask&&data.tasks){data.tasks.push(clone(masterTask));}
    });
    ["d1","d2","d3","d4","d5"].forEach(function(id){
      var masterDecision=(published.decisions||[]).find(function(d){return d.id===id;});
      var localDecision=(data.decisions||[]).find(function(d){return d.id===id;});
      if(masterDecision&&localDecision)Object.assign(localDecision,clone(masterDecision));
    });
    ["b2","b3","b5","b6","b7","b11","b12","b13"].forEach(function(id){
      var masterBudget=(published.budget||[]).find(function(b){return b.id===id;});
      var localBudget=(data.budget||[]).find(function(b){return b.id===id;});
      if(masterBudget&&localBudget){
        localBudget.status=masterBudget.status;
        localBudget.name=masterBudget.name;
      }else if(masterBudget&&data.budget){data.budget.push(clone(masterBudget));}
    });
    // Route-description facts from GitHub override obsolete old-device text.
    (published.routeOptions||[]).forEach(function(masterOpt){
      var localOpt=(data.routeOptions||[]).find(function(o){return o.id===masterOpt.id;});
      if(localOpt)Object.assign(localOpt,clone(masterOpt));
    });
    if(published.domesticBaggage)data.domesticBaggage=clone(published.domesticBaggage);
    if(published.publicCostOverview)data.publicCostOverview=clone(published.publicCostOverview);
    var masterBoracay=(published.stays||[]).find(function(x){return x.id==="stay-boracay";});
    var localBoracay=(data.stays||[]).find(function(x){return x.id==="stay-boracay";});
    if(masterBoracay&&localBoracay)Object.assign(localBoracay,clone(masterBoracay));

    // Do not carry previously published personal cost-sharing or exact child-age
    // records into the active browser copy after the privacy cleanup.
    delete data.costSharing;
    if(data.party&&published.party)data.party=clone(published.party);
    (data.stays||[]).forEach(function(stay){
      if(stay.booking){
        delete stay.booking.childrenAgesOnBooking;
        delete stay.booking.arrivalWindow;
        delete stay.booking.nonSmokingRequested;
      }
    });
    // Remove historical price estimates for flights that are now confirmed.
    data.quotes=(data.quotes||[]).filter(function(q){return ["q1","q2","q3","q4"].indexOf(q.id)===-1;});
    if(published.stayPreference)data.stayPreference=published.stayPreference;
    var mappedHotel=(published.places||[]).find(function(p){return p.id==="twoseasons";});
    if(mappedHotel){data.places=data.places||[];if(!data.places.some(function(p){return p.id==="twoseasons";}))data.places.push(clone(mappedHotel));}
    delete data.film;
    if(local.version!==published.version)notice("En ny version finns på GitHub. Bekräftade bokningar har uppdaterats även här. Övriga lokala ändringar finns kvar.","sync");
    byId("dataState").textContent="Lokalt redigerad";
  }else{data=clone(published);byId("dataState").textContent="Synkad med GitHub";}
  render();setupMap();showView(activeView);
 }catch(e){
  var previous=locallySaved();
  if(previous&&previous.plan){data=previous.plan;render();setupMap();showView(activeView);notice("GitHub-planen gick inte att läsa. Visar sparad kopia på den här enheten.","error");}
  else{notice("Kunde inte läsa resa/plan.json. Kontrollera uppkopplingen eller uppdatera sidan. "+e.message,"error");byId("dataState").textContent="Kan inte läsa data";}
 }
}
init();
})();