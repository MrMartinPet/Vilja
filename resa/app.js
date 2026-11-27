(function(){
"use strict";
var PLAN_FILE="plan.json", LOCAL_KEY="vilja-philippines-2027-local-v1";
var data=null, published=null, map=null, markerLayer=null, routeLayer=null, taskFilter="open", activityFilter="Alla", modalSave=null, toastTimer=null, activeView="overview";
var byId=function(id){return document.getElementById(id);};
var clone=function(o){return JSON.parse(JSON.stringify(o));};
var esc=function(x){return String(x===null||x===undefined?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var safeUrl=function(u){try{var url=new URL(u,location.href);return /^https?:$/.test(url.protocol)?url.href:"";}catch(e){return "";}};
var money=function(x){return typeof x==="number" && Number.isFinite(x)?new Intl.NumberFormat("sv-SE",{minimumFractionDigits:0,maximumFractionDigits:2}).format(x)+" kr":"–";};
var num=function(x){return x===null||x===undefined||x===""?null:Number(x);};
var dateLabel=function(s){var d=new Date(s.slice(0,10)+"T12:00:00Z");return new Intl.DateTimeFormat("sv-SE",{day:"numeric",month:"short",timeZone:"UTC"}).format(d);};
var statusName={booked:"Bokat",paid:"Betalt",selected:"Valt · ej bokat",planned:"Planerat · ej bokat",todo:"Ej bokat",decision:"Beslut kvar"};
var iconName={"flyg":"✈️","hotell":"🏨","bil":"🚐","båt":"⛴️","val":"⚖️","tåg":"🚆","buss":"🚌"};
var stayIcon={"villa":"🌴","hotell":"🛏️","lägenhet":"🏡"};
function badge(status){return '<span class="status '+esc(status||"todo")+'">'+esc(statusName[status]||"Ej bokat")+'</span>';}
function link(url,title,css){return safeUrl(url)?'<a class="'+(css||"")+'" target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(url))+'">'+esc(title)+' ↗</a>':"";}
function notice(msg){var el=byId("errorBanner");if(el){el.textContent=msg;el.hidden=false;}}
function freshness(){
 var now=new Date(),departure=new Date("2027-02-08T00:00:00");
 var days=Math.ceil((departure.getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/86400000);
 byId("daysLeft").textContent=days>=0?days:"Pågår";
 var updated=(published&&published.updated)?new Date(published.updated+"T12:00:00Z") : null;
 var dateText=updated?new Intl.DateTimeFormat("sv-SE",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(updated):"–";
 byId("lastUpdated").textContent="Senast uppdaterad "+dateText;
 byId("dataState").textContent="Aktuell resplan";
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
  var b=stay.booking||null,booked=stay.status==="booked"||stay.status==="paid";
  var stayBody='<article class="stay-card'+(booked?' stay-card-booked':stay.status==='planned'?' stay-card-planned':'')+'"><div class="stay-graphic"><span>'+esc(stayIcon[stay.kind]||"🏝️")+'</span><b>'+esc(stay.nights)+' natt'+(stay.nights===1?"":"er")+'</b></div>'+
   '<div>'+badge(stay.status)+'</div><h3>'+esc(stay.place)+'</h3>'+
   '<p>'+esc(dateLabel(stay.from))+'–'+esc(dateLabel(stay.to))+' · '+esc(stay.area)+'</p>'+
   '<p>'+esc(stay.suggestion||"")+'</p>';
   if(Number.isFinite(stay.estimatedTotalSEK))stayBody+='<div class="stay-estimated-cost">💰 Preliminärt: <strong>'+money(stay.estimatedTotalSEK)+'</strong>'+(stay.costNote?' · '+esc(stay.costNote):' totalt · <strong>'+money(stay.estimatedTotalSEK/2)+'</strong> per familj (50/50)')+'</div>';
   if(stay.planNote)stayBody+='<p class="stay-planned-note">'+esc(stay.planNote)+'</p>';
  if(b&&b.confirmed){
   var rooms=b.roomCount||b.rooms;
   stayBody+='<div class="stay-booked-info"><strong>'+(b.provisional?'◷ Preliminär hotellbokning':'✓ Bekräftad bokning')+'</strong>';
   if(rooms||b.roomType)stayBody+='<div class="stay-booked-row">🛏️ '+(rooms?esc(rooms)+' rum':'Rum')+(b.roomType?' · '+esc(b.roomType):'')+'</div>';
   if(b.adults!=null&&b.childrenCount!=null)stayBody+='<div class="stay-booked-row">👨‍👩‍👧‍👦 '+esc(b.adults)+' vuxna och '+esc(b.childrenCount)+' barn · '+esc(stay.nights)+' natt'+(stay.nights===1?'':'er')+'</div>';
   else if(b.maximumOccupancyShown)stayBody+='<div class="stay-booked-row">👨‍👩‍👧‍👦 '+esc(b.maximumOccupancyShown)+'</div>';
   if(b.roomSizeSqm||b.bedsPerRoom)stayBody+='<div class="stay-booked-row">📐 '+(b.roomSizeSqm?esc(b.roomSizeSqm)+' m² per rum':'')+(b.bedsPerRoom?' · '+esc(b.bedsPerRoom):'')+'</div>';
   if(b.checkInFrom||b.checkOutBefore)stayBody+='<div class="stay-booked-row">🕒 '+(b.checkInFrom?'Incheckning från '+esc(b.checkInFrom):'')+(b.checkOutBefore?' · utcheckning före '+esc(b.checkOutBefore):'')+'</div>';
   if(b.included&&b.included.length)stayBody+='<div class="stay-booked-row">☕ Inkluderat: '+esc(b.included.join(", "))+'</div>';
   if(Number.isFinite(b.totalSEK))stayBody+='<div class="stay-booked-row">💳 Bokningspris: '+esc(new Intl.NumberFormat("sv-SE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(b.totalSEK))+' kr · '+esc(b.paymentStatus||"")+'</div>';
   if(b.freeCancellationBefore)stayBody+='<div class="stay-booked-row">✅ Gratis avbokning före '+esc(dateLabel(b.freeCancellationBefore))+' 2027'+(b.freeCancellationTime?' kl. '+esc(b.freeCancellationTime):'')+'</div>';
   if(b.paymentScheduledDate)stayBody+='<div class="stay-booked-row">📅 Planerad debitering '+esc(dateLabel(b.paymentScheduledDate))+' 2027</div>';
   if(b.facilities&&b.facilities.length)stayBody+='<div class="stay-booked-row">ℹ️ '+esc(b.facilities.join(" · "))+'</div>';
   if(stay.id==="stay-boracay"){
     stayBody+='<div class="stay-booked-row">🏝️ Direkt poolaccess, markplan och White Beach vid hotellet</div>'+
      '<div class="stay-booked-note">Badrumsfråga kvar: det är ännu inte bekräftat om sviten har två badrum.</div>';
   }else if(b.notes)stayBody+='<div class="stay-booked-note">'+esc(b.notes)+'</div>';
   else if(b.note)stayBody+='<div class="stay-booked-note">'+esc(b.note)+'</div>';
   stayBody+='</div>';
  }
  stayBody+=(stay.alternatives&&stay.alternatives.length&&!booked&&stay.status!=='planned'?'<div class="stay-alternatives"><strong>Boenden att jämföra</strong>'+stay.alternatives.map(function(a){return '<div class="stay-alt"><div>'+link(a.url,a.name)+'</div><small>'+esc(a.status||"Ej bokat")+'</small><p>'+esc(a.details||"")+'</p></div>';}).join("")+'</div>':"");
  stayBody+='<div class="stay-footer">'+link(stay.link,booked?"Visa bokat boende":stay.status==="planned"?"Visa valt hotell":"Sök boende")+'</div></article>';
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
    '</div></article>';
 }).join("");
}
function renderTasks(){
 var tasks=data.tasks||[],done=tasks.filter(function(t){return t.done;}).length,pct=tasks.length?Math.round(done/tasks.length*100):100;
 byId("taskProgressLabel").textContent=pct+" % klart";
 byId("taskProgressCaption").textContent=done+" / "+tasks.length;
 byId("taskProgressBar").style.width=pct+"%";
 var filtered=tasks.filter(function(t){return taskFilter==="all"||(taskFilter==="open"&&!t.done)||(taskFilter==="done"&&t.done);});
 byId("taskList").innerHTML=filtered.length?filtered.map(function(t){
  return '<div class="task-row '+(t.done?"is-done":"")+'"><span class="task-indicator" aria-label="'+(t.done?'Klar':'Kvar')+'">'+(t.done?'✓':'○')+'</span>'+
    '<div class="task-content"><b>'+esc(t.title)+'</b><small>'+esc(t.note||"")+'</small></div>'+
    '<div class="task-side"><span class="category-pill '+esc(t.priority)+'">'+esc(t.category)+'</span></div></div>';
 }).join(""):'<p class="subtle">Inga uppgifter i den här vyn.</p>';
 Array.from(byId("taskFilters").querySelectorAll("button")).forEach(function(b){b.classList.toggle("active",b.dataset.filter===taskFilter);});
}
function renderDecisions(){
 var open=(data.decisions||[]).filter(function(d){return !d.choice;});
 byId("decisionsGrid").innerHTML=open.map(function(d){
   return '<article class="pending-decision"><div class="pending-decision-text"><strong>'+esc(d.title)+'</strong><p>'+esc(d.note||d.why||"")+'</p></div></article>';
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
 var rows=data.publicCostOverview||[];
 var fmt=function(n){return Number.isFinite(n)?new Intl.NumberFormat("sv-SE",{minimumFractionDigits:0,maximumFractionDigits:2}).format(n)+" kr":"Pris saknas";};
 var cents=function(n){return Math.round((Number.isFinite(n)?n:0)*100);};
 var total=0,mm=0,pe=0;
 rows.forEach(function(x){
  if(x.excludeFromTotals||!Number.isFinite(x.amountSEK))return;
  total+=cents(x.amountSEK);
  if(x.splitSEK){mm+=cents(x.splitSEK.mm);pe+=cents(x.splitSEK.pe);}
 });
 var hasEstimates=rows.some(function(x){return !x.excludeFromTotals&&x.estimated===true&&Number.isFinite(x.amountSEK);});
  var withEstimate=function(v){return (hasEstimates?"ca ":"")+fmt(v);};
  byId("allCostTotal").textContent=withEstimate(total/100);
 byId("mmCostTotal").textContent=withEstimate(mm/100);
 byId("peCostTotal").textContent=withEstimate(pe/100);
 var totalAmount=total/100,mmAmount=mm/100,peAmount=pe/100,mmPct=total?100*mm/total:0,pePct=total?100*pe/total:0;
 byId("overviewBookedTotal").textContent=withEstimate(totalAmount);
 byId("overviewMmCost").textContent=withEstimate(mmAmount);
 byId("overviewPeCost").textContent=withEstimate(peAmount);
 byId("overviewMmPct").textContent=new Intl.NumberFormat("sv-SE",{maximumFractionDigits:1}).format(mmPct)+" %";
 byId("overviewPePct").textContent=new Intl.NumberFormat("sv-SE",{maximumFractionDigits:1}).format(pePct)+" %";
 byId("overviewMmBar").style.width=mmPct+"%";
 byId("overviewPeBar").style.width=pePct+"%";
 byId("costOverviewList").innerHTML=rows.map(function(x){
  var unknown=!Number.isFinite(x.amountSEK);
  var state=x.status==="paid"?"Betalt":x.status==="booked"?(x.estimated?"Preliminärt bokat · uppskattat pris":"Bokat"):x.status==="planned"?"Planerat · ej bokat":"Ej bokat";
  var preliminary=x.allocationStatus==="preliminary";
  var splits=x.splitSEK?'<small class="cost-line-split">'+(x.partialAccommodation?'M&M (4 av 5): '+esc(fmt(x.splitSEK.mm))+' · P&E-boende: pris saknas':'M&M: '+esc(fmt(x.splitSEK.mm))+' · P&E: '+esc(fmt(x.splitSEK.pe))+(preliminary?' · preliminär 65/35-fördelning':x.splitNote?' · '+esc(x.splitNote):''))+'</small>':(x.allocationNote?'<small class="cost-line-split">'+esc(x.allocationNote)+'</small>':'');
  return '<div class="cost-line"><div class="cost-line-name"><strong>'+esc(x.name)+'</strong><small>'+esc(x.scope)+' · '+esc(state)+'</small>'+splits+'</div><b class="'+(unknown?'cost-unknown':'')+'">'+esc((x.estimated&&!unknown?'ca ':'')+fmt(x.amountSEK))+'</b></div>';
 }).join("");
}
function renderBudget(){
 var rows=data.budget||[];
 var totals=rows.filter(function(x){return !x.excludeFromTotals&&Number.isFinite(x.totalSEK);}).map(function(x){return x.totalSEK;});
 var paid=rows.filter(function(x){return !x.excludeFromTotals&&Number.isFinite(x.paidSEK);}).map(function(x){return x.paidSEK;});
 byId("budgetTotal").textContent=totals.length?(rows.some(function(x){return !x.excludeFromTotals&&x.estimated&&Number.isFinite(x.totalSEK);})?"ca ":"")+money(totals.reduce(function(a,b){return a+b;},0)):"Ej ifyllt";
 byId("budgetPaid").textContent=paid.length?money(paid.reduce(function(a,b){return a+b;},0)):"Ej ifyllt";
 byId("budgetRows").innerHTML=rows.map(function(b){
  return '<tr><td>'+esc(b.name)+'</td><td>'+badge(b.status)+'</td><td class="numeric">'+(b.estimated&&Number.isFinite(b.totalSEK)?'ca ':'')+money(b.totalSEK)+'</td><td class="numeric">'+money(b.paidSEK)+'</td></tr>';
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
 if(map)drawMap();
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
 line(["mnl","tag"],"#08a09b");line(["alona","tagport"],"#d49b68");line(["tagport","cebport"],"#1590ad");line(["cebport","ceb"],"#d49b68");line(["ceb","mph"],"#08a09b");line(["mph","caticlanport","cagban"],"#d49b68");line(["mph","mnl"],"#08a09b");
}
function mapScope(scope){
 if(!map||!window.L)return;
 var ids=scope==="Bohol"?["alona","tag","loboc","balicasag","pamilacan","tagport","chocolate"]:scope==="Boracay"?["mph","caticlanport","cagban","white","nabaoy","carabao"]:["mnl","alona","ceb","mph","cagban"];
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
  var filter=e.target.closest("[data-filter]");
  if(filter){taskFilter=filter.dataset.filter;renderTasks();return;}
  var island=e.target.closest("[data-island]");
  if(island){activityFilter=island.dataset.island;renderActivities();return;}
 });
 byId("mapAll").addEventListener("click",function(){mapScope("Alla");});
 byId("mapBohol").addEventListener("click",function(){mapScope("Bohol");});
 byId("mapBoracay").addEventListener("click",function(){mapScope("Boracay");});
}
async function init(){
 bind();
 try{
  // Previously each device could hold its own conflicting version. From now on
  // the published plan is the only source of truth.
  try{localStorage.removeItem(LOCAL_KEY);}catch(e){}
  var res=await fetch(PLAN_FILE,{cache:"no-store"});
  if(!res.ok)throw new Error("HTTP "+res.status);
  published=await res.json();
  if(!published||!Array.isArray(published.tasks))throw new Error("Dataformat");
  data=clone(published);
  render();
  setupMap();
  showView(activeView);
 }catch(e){
  notice("Kunde inte läsa resplanen. Kontrollera uppkopplingen och uppdatera sidan.","error");
  byId("dataState").textContent="Kunde inte hämta resplanen";
 }
}
init();
})();