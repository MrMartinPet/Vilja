(function(){
"use strict";
var PLAN_FILE="plan.json", LOCAL_KEY="vilja-philippines-2027-local-v1";
var data=null, published=null, map=null, markerLayer=null, routeLayer=null, taskFilter="open", activityFilter="Alla", modalSave=null, toastTimer=null;
var byId=function(id){return document.getElementById(id);};
var clone=function(o){return JSON.parse(JSON.stringify(o));};
var esc=function(x){return String(x===null||x===undefined?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
var safeUrl=function(u){try{var url=new URL(u,location.href);return /^https?:$/.test(url.protocol)?url.href:"";}catch(e){return "";}};
var money=function(x){return typeof x==="number" && Number.isFinite(x)?new Intl.NumberFormat("sv-SE",{maximumFractionDigits:0}).format(x)+" kr":"–";};
var num=function(x){return x===null||x===undefined||x===""?null:Number(x);};
var dateLabel=function(s){var d=new Date(s.slice(0,10)+"T12:00:00Z");return new Intl.DateTimeFormat("sv-SE",{day:"numeric",month:"short",timeZone:"UTC"}).format(d);};
var statusName={booked:"Bokat",paid:"Betalt",selected:"Valt · ej bokat",todo:"Ej bokat",decision:"Beslut kvar"};
var iconName={"flyg":"✈️","hotell":"🏨","bil":"🚐","båt":"⛴️","val":"⚖️"};
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
 byId("stayGrid").innerHTML=list.map(function(stay,i){
  return '<article class="stay-card"><div class="stay-graphic"><span>'+esc(stayIcon[stay.kind]||"🏝️")+'</span><b>'+esc(stay.nights)+' natt'+(stay.nights===1?"":"er")+'</b></div>'+
    '<div>'+badge(stay.status)+'</div><h3>'+esc(stay.place)+'</h3>'+
    '<p>'+esc(dateLabel(stay.from))+'–'+esc(dateLabel(stay.to))+' · '+esc(stay.area)+'</p>'+
    '<p>'+esc(stay.suggestion||"")+'</p>'+
    '<div class="stay-footer">'+link(stay.link,"Sök boende")+'<button class="edit-icon" data-edit="stay" data-id="'+esc(stay.id)+'">Ändra</button></div></article>';
 }).join("");
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
 byId("decisionsGrid").innerHTML=(data.decisions||[]).map(function(d){
  var items=['<option value="">Inte bestämt</option>'].concat((d.options||[]).map(function(o){return '<option value="'+esc(o)+'" '+(d.choice===o?"selected":"")+'>'+esc(o)+'</option>';}));
  return '<article class="decision-card"><div class="decision-head"><span class="section-tag '+(d.choice?"":"amber")+'">'+(d.choice?"Beslutat":"Behöver beslut")+'</span><small class="subtle">'+(d.priority==="high"?"Hög prioritet":"Planeras")+'</small></div>'+
   '<h3>'+esc(d.title)+'</h3><p>'+esc(d.why||"")+'</p><label class="field-label" for="dec-'+esc(d.id)+'">Vårt val</label>'+
   '<select id="dec-'+esc(d.id)+'" data-decision="'+esc(d.id)+'">'+items.join("")+'</select><div class="small-note">'+esc(d.note||"")+'</div>'+
   '<button class="edit-icon" data-edit="decision" data-id="'+esc(d.id)+'">Redigera beslut / anteckning</button></article>';
 }).join("");
 byId("routeCompare").innerHTML=(data.routeOptions||[]).map(function(op){
   return '<article class="compare-card"><span class="section-tag">'+esc(op.tag)+'</span><h4>'+esc(op.title)+'</h4>'+
   '<small>⏱ '+esc(op.duration)+'</small><p>'+esc(op.description)+'</p><p class="pros">✓ '+esc(op.benefit)+'</p><p class="risks">! '+esc(op.risk)+'</p>'+link(op.url,"Se flyg")+'</article>';
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
 byId("quoteList").innerHTML=(data.quotes||[]).map(function(q){
  return '<article class="quote-card"><small>'+esc(q.leg)+' · '+esc(q.people)+' personer</small><b>'+money(q.amount)+'</b><p>'+esc(q.note)+'</p></article>';
 }).join("");
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
 renderStats();renderStays();renderLegs();renderTasks();renderDecisions();renderBudget();renderActivities();freshness();
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
 line(["mnl","tag"],"#08a09b");line(["alona","tagport"],"#d49b68");line(["tagport","cebport"],"#1590ad");line(["cebport","ceb"],"#d49b68");line(["ceb","mph"],"#08a09b");line(["mph","caticlanport","cagban","white"],"#d49b68");line(["mph","mnl"],"#08a09b");
}
function mapScope(scope){
 if(!map||!window.L)return;
 var ids=scope==="Bohol"?["alona","tag","loboc","balicasag","pamilacan","tagport","chocolate"]:scope==="Boracay"?["mph","caticlanport","cagban","white","nabaoy","carabao"]:["mnl","alona","ceb","mph","white"];
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
  var button=e.target.closest("[data-edit]");if(button){openModal(button.dataset.edit,button.dataset.id);return;}
  var filter=e.target.closest("[data-filter]");if(filter){taskFilter=filter.dataset.filter;renderTasks();return;}
  var island=e.target.closest("[data-island]");if(island){activityFilter=island.dataset.island;renderActivities();return;}
 });
 document.addEventListener("change",function(e){
  if(e.target.dataset.task){var item=(data.tasks||[]).find(function(t){return t.id===e.target.dataset.task;});if(item){item.done=!!e.target.checked;save(true);}return;}
  if(e.target.dataset.decision){var d=(data.decisions||[]).find(function(x){return x.id===e.target.dataset.decision;});if(d){d.choice=e.target.value;save(true);toast("Beslutet sparat på den här enheten.");}}
 });
 byId("openEditor").addEventListener("click",function(){document.getElementById("anteckningar").scrollIntoView({behavior:"smooth"});});
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
    if(local.version!==published.version)notice("Det finns en ny publicerad version. Dina lokala ändringar visas fortfarande. Exportera dem först om du vill hämta den nya planen.","sync");
    byId("dataState").textContent="Lokalt redigerad";
  }else{data=clone(published);byId("dataState").textContent="Synkad med GitHub";}
  render();setupMap();
 }catch(e){
  var previous=locallySaved();
  if(previous&&previous.plan){data=previous.plan;render();setupMap();notice("GitHub-planen gick inte att läsa. Visar sparad kopia på den här enheten.","error");}
  else{notice("Kunde inte läsa resa/plan.json. Kontrollera uppkopplingen eller uppdatera sidan. "+e.message,"error");byId("dataState").textContent="Kan inte läsa data";}
 }
}
init();
})();