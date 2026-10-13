(function(){
  'use strict';
  const labels={easy:'Starta lugnt',mixed:'Rymdäventyr',doubles:'Dubbelstjärnor'};
  const storageKey='vilja-star-math-v1';
  const shuffle=values=>{const copy=values.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
  function pool(level){
    const questions=[];
    for(let a=1;a<=9;a++)for(let b=a;b<=9;b++){
      if(level==='easy'&&a+b>10)continue;
      if(level==='doubles'&&a!==b)continue;
      questions.push({a,b});
    }
    return questions;
  }
  function makeRound(level){
    const source=pool(level);let questions=shuffle(source);
    while(questions.length<10){const extra=shuffle(source);if(extra[0].a===questions[questions.length-1].a)extra.reverse();questions.push(...extra);}
    return questions.slice(0,10).map(q=>Math.random()<.5?{a:q.b,b:q.a}:q);
  }
  function choices(q){
    const answer=q.a+q.b,candidates=[];
    for(let n=Math.max(0,answer-3);n<=Math.min(18,answer+3);n++)if(n!==answer)candidates.push(n);
    return shuffle([answer,...shuffle(candidates).slice(0,3)]);
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={pool,makeRound,choices};
  if(typeof document==='undefined')return;
  const el=id=>document.getElementById(id);
  let level='easy',questions=[],index=0,firstTry=0,attempted=false,solved=false,completed=false;
  function total(){try{const n=Number(localStorage.getItem(storageKey));return Number.isSafeInteger(n)&&n>=0?n:0;}catch(e){return 0;}}
  function show(id){['setup','play','done'].forEach(key=>el(key).hidden=key!==id);window.scrollTo(0,0);}
  function setup(){show('setup');const n=total();el('record').textContent=n?'Du har klarat '+n+' rymduppdrag på den här enheten. ⭐':'Välj en planet för att börja.';}
  function start(selected){level=selected;questions=makeRound(level);index=0;firstTry=0;completed=false;show('play');render();}
  function render(){
    const q=questions[index];attempted=false;solved=false;
    el('counter').textContent=labels[level]+' · '+(index+1)+'/10';
    el('stars').replaceChildren();for(let n=0;n<10;n++){const star=document.createElement('span');star.className='star'+(n<index?' won':'');star.textContent='★';star.setAttribute('aria-hidden','true');el('stars').appendChild(star);}
    el('stars').setAttribute('aria-label',index+' av 10 stjärnor');
    el('question').textContent=q.a+' + '+q.b+' = ?';el('feedback').textContent='Vilket svar är rätt?';el('next').hidden=true;
    el('next').textContent=index===9?'Visa mina stjärnor ⭐':'Nästa stjärna →';
    el('help').hidden=true;el('helpBtn').setAttribute('aria-expanded','false');el('helpBtn').hidden=false;
    el('answers').replaceChildren();choices(q).forEach(value=>{const button=document.createElement('button');button.className='answer';button.textContent=value;button.setAttribute('aria-label','Svara '+value);button.addEventListener('click',()=>answer(value,button));el('answers').appendChild(button);});
  }
  function answer(value,button){
    if(solved)return;
    const q=questions[index];
    if(value!==q.a+q.b){attempted=true;button.disabled=true;button.classList.add('wrong');el('feedback').textContent='Nästan! Prova igen. Du kan ta hjälp av prickarna.';return;}
    solved=true;if(!attempted)firstTry++;
    button.classList.add('correct','pop');el('answers').querySelectorAll('button').forEach(b=>b.disabled=true);
    const star=el('stars').children[index];star.classList.add('won','pop');el('stars').setAttribute('aria-label',(index+1)+' av 10 stjärnor');
    el('feedback').textContent='Rätt! '+q.a+' + '+q.b+' = '+value+'. En stjärna till! ⭐';el('next').hidden=false;el('next').focus();
  }
  function help(){
    const q=questions[index],hidden=!el('help').hidden;el('help').hidden=hidden;el('helpBtn').setAttribute('aria-expanded',String(!hidden));if(hidden)return;
    el('legend').innerHTML='<span class="cyan">'+q.a+' blå</span> + <span class="pink">'+q.b+' rosa</span>';
    el('tip').textContent='Börja på '+q.a+' och räkna '+q.b+' steg till. Räkna prickarna om du vill.';
    el('frames').replaceChildren();
    for(let row=0;row<2;row++){const frame=document.createElement('div');frame.className='frame';for(let i=0;i<10;i++){const n=row*10+i,dot=document.createElement('span');dot.className='dot'+(n<q.a?' first':n<q.a+q.b?' second':'');frame.appendChild(dot);}el('frames').appendChild(frame);}
  }
  function finish(){
    if(completed)return;completed=true;try{localStorage.setItem(storageKey,String(total()+1));}catch(e){}
    el('summary').textContent='10 av 10 tal lösta! '+(firstTry===10?'Alla rätt på första försöket. Fantastiskt!':firstTry+' rätt på första försöket. Du fortsatte och klarade alla!');show('done');el('again').focus();
  }
  document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>start(button.dataset.level)));
  el('helpBtn').addEventListener('click',help);el('next').addEventListener('click',()=>{if(!solved)return;if(index===9)finish();else{index++;render();el('answers').querySelector('button').focus();}});
  el('menu').addEventListener('click',setup);el('levels').addEventListener('click',setup);el('again').addEventListener('click',()=>start(level));setup();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
