'use strict';
const T = ClockTime;
const $ = id => document.getElementById(id);
const levels = [[0, 30], [0, 15, 30, 45], Array.from({length: 12}, (_, i) => i * 5), Array.from({length: 60}, (_, i) => i)];
let time = 600, exploring = false, session, task, done = false, attempts = 0, assisted = false, drag;
let hintShown = false;
try {
  const settings = JSON.parse(localStorage.getItem('vilja-clock-settings'));
  if (settings && ['mix', 'set', 'words', 'read'].includes(settings.mode)) $('mode').value = settings.mode;
  if (settings && [0, 1, 2, 3].includes(settings.level)) $('level').value = settings.level;
} catch {}
function svgNode(tag,attrs){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
for(let i=0;i<60;i++){const a=i*Math.PI/30,r=i%5===0?143:148; $('ticks').append(svgNode('line',{x1:180+Math.sin(a)*r,y1:180-Math.cos(a)*r,x2:180+Math.sin(a)*153,y2:180-Math.cos(a)*153,class:i%5===0?'tick major':'tick'}));}
for(let i=1;i<=12;i++){const a=i*Math.PI/6,n=svgNode('text',{x:180+Math.sin(a)*123,y:180-Math.cos(a)*123,class:'number'});n.textContent=i;$('numbers').append(n);const m=svgNode('text',{x:180+Math.sin(a)*164,y:180-Math.cos(a)*164,class:'minute-number'});m.textContent=i===12?'00':i*5;$('minuteNumbers').append(m);}
function canMove() { return exploring || (!done && task?.mode !== 'read'); }
function render() {
  time = T.normalize(time);
  const a = T.angles(time);
  $('hourHand').setAttribute('transform', `rotate(${a.hour} 180 180)`);
  $('minuteHand').setAttribute('transform', `rotate(${a.minute} 180 180)`);
  for (const id of ['hourHand', 'minuteHand']) {
    const hand = $(id);
    hand.setAttribute('aria-valuenow', time);
    hand.setAttribute('aria-valuetext', T.digital(time));
    hand.setAttribute('aria-disabled', !canMove());
    hand.setAttribute('tabindex', canMove() ? '0' : '-1');
  }
  if (task?.mode === 'read' && !exploring) {
    const hour = (time % 720) / 60;
    for (const id of ['hourHand', 'minuteHand']) $(id).removeAttribute('aria-valuetext');
    $('clock').setAttribute('aria-label', `Korta visaren ${Number.isInteger(hour) ? 'på ' + (hour || 12) : 'mellan ' + (Math.floor(hour) || 12) + ' och ' + ((Math.floor(hour) + 1) % 12 || 12)}, långa visaren på ${time % 60 / 5 || 12}.`);
  } else $('clock').setAttribute('aria-label', 'Dra visarna för att ställa klockan. Piltangenter flyttar markerad visare.');
  $('liveTime').textContent = T.digital(time);
  $('liveWords').textContent = T.words(time);
  $('morning').setAttribute('aria-pressed', time < 720);
  $('evening').setAttribute('aria-pressed', time >= 720);
  $('morning').disabled = $('evening').disabled = !canMove();
  $('minuteNumbers').style.display = $('showMinutes').checked ? '' : 'none';
}
function setTime(value) { if (canMove()) { time = T.normalize(value); render(); } }
// A stable, finger-friendly control: five-minute stops except in the
// optional "Alla minuter" exercise, where single minutes remain necessary.
function minuteStep() {
  return !exploring && Number($('level').value) === 3 ? 1 : 5;
}
function clockPoint(e) {
  const p = $('clock').createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform($('clock').getScreenCTM().inverse());
}
function pointAngle(p) {
  return T.mod(Math.atan2(p.x - 180, 180 - p.y) * 30 / Math.PI, 60);
}
function radiusOf(p) { return Math.hypot(p.x - 180, p.y - 180); }
function nearHand(p, mark, inner, outer, tolerance) {
  const r = radiusOf(p), offset = T.delta(mark, pointAngle(p));
  // Test the visible, outward-facing hand; avoid the unstable hub of the clock.
  return r >= inner && r <= outer && Math.abs(offset) < 8 &&
    Math.abs(Math.sin(offset * Math.PI / 30) * r) <= tolerance;
}
// Tapping the outer dial sets the long hand immediately. Dragging afterwards
// tracks the finger's actual angular travel and snaps to five-minute marks.
$('clock').addEventListener('pointerdown', e => {
  if (!canMove() || drag || e.button !== 0) return;
  const p = clockPoint(e), r = radiusOf(p);
  if (r < 55) return; // Near the centre, tiny movements create huge angle changes.
  e.preventDefault();
  const angle = pointAngle(p), hands = T.angles(time);
  const hour = nearHand(p, hands.hour / 6, 55, 111, 21);
  const minute = nearHand(p, hands.minute / 6, 89, 153, 23);
  const selected = hour ? 'hour' : 'minute';
  if (selected === 'minute' && !minute) {
    const minuteValue = Math.round(angle / minuteStep()) * minuteStep() % 60;
    setTime(Math.floor(time / 60) * 60 + minuteValue);
  }
  drag = {id: e.pointerId, hand: selected, previous: angle, travel: 0, startTime: time};
  $('clock').setPointerCapture(e.pointerId);
});
$('clock').addEventListener('pointermove', e => {
  if (!drag || drag.id !== e.pointerId) return;
  e.preventDefault();
  const p = clockPoint(e);
  if (radiusOf(p) < 60) {
    // Suspend movement through the middle instead of interpreting wild rotations.
    drag.previous = null;
    return;
  }
  const angle = pointAngle(p);
  if (drag.previous === null) { drag.previous = angle; return; }
  const difference = T.delta(drag.previous, angle);
  drag.previous = angle;
  if (Math.abs(difference) > 15) return; // Discard impossible pointer jumps.
  drag.travel += difference;
  if (drag.hand === 'minute') {
    const step = minuteStep();
    setTime(Math.round((drag.startTime + drag.travel) / step) * step);
  } else {
    // Move whole hours, keeping the chosen minutes exactly as they were.
    setTime(drag.startTime + Math.round(drag.travel / 5) * 60);
  }
});
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  $('clock').addEventListener(name, e => { if (drag?.id === e.pointerId) drag = null; });
}
// Prevent browser panning even when a finger misses a hand entirely.
$('clock').addEventListener('touchmove', e => e.preventDefault(), {passive: false});
for (const id of ['minuteHand', 'hourHand']) {
  $(id).addEventListener('keydown', e => {
    const step = {ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1}[e.key];
    if (step) { e.preventDefault(); setTime(time + step * (id === 'hourHand' ? 60 : minuteStep()) * (e.shiftKey ? 5 : 1)); }
  });
}
$('morning').onclick = () => setTime(time % 720);
$('evening').onclick = () => setTime(time % 720 + 720);
$('showMinutes').onchange = render;
function shuffle(a) { return a.map(v => ({v, r: Math.random()})).sort((a, b) => a.r - b.r).map(x => x.v); }
function makeTasks() {
  const mode = $('mode').value;
  const pool = shuffle(levels[Number($('level').value)]);
  return Array.from({length: 8}, (_, i) => {
    const exercise = mode === 'mix' ? (i % 2 ? 'words' : 'set') : mode;
    let minute = pool[i % pool.length];
    if (exercise === 'words') minute = Math.round(minute / 5) * 5 % 60;
    return {mode: exercise, target: Math.floor(Math.random() * 24) * 60 + minute};
  });
}
function feedback(text = '', good = false) {
  $('feedback').textContent = text;
  $('feedback').className = good ? 'good' : '';
}
function showMode(explore) {
  exploring = explore; drag = null;
  document.body.classList.toggle('exploring', explore);
  $('practiceTab').classList.toggle('active', !explore);
  $('exploreTab').classList.toggle('active', explore);
  $('practiceTab').setAttribute('aria-pressed', !explore);
  $('exploreTab').setAttribute('aria-pressed', explore);
  $('summary').hidden = true;
  $('play').hidden = false;
  $('live').hidden = !explore;
  $('answerForm').hidden = true;
  $('periodControl').hidden = false;
  $('solution').setAttribute('hidden', '');
  if (explore) {
    task = null; done = false;
    $('counter').textContent = '';
    $('question').textContent = 'Utforska klockan';
    $('context').textContent = '';
    $('check').hidden = $('next').hidden = $('hint').hidden = true;
    $('instruction').textContent = 'Dra minutvisaren i steg om 5 minuter. Timvisaren flyttas en timme i taget.';
    feedback(); render();
  } else start();
}
function start(tasks) {
  session = {tasks: tasks || makeTasks(), index: 0, solved: 0, missed: []};
  $('summary').hidden = true;
  $('play').hidden = false;
  showTask();
}
function showTask() {
  task = session.tasks[session.index];
  done = false; attempts = 0; assisted = false; hintShown = false; drag = null;
  $('solution').setAttribute('hidden', '');
  $('counter').textContent = `${session.index + 1} av ${session.tasks.length}`;
  $('question').textContent = task.mode === 'read' ? 'Vad är klockan?' : `Ställ klockan på ${task.mode === 'words' ? T.words(task.target) : T.digital(task.target)}`;
  $('context').textContent = task.mode === 'set' ? '' : (task.target < 720 ? 'Natt / förmiddag · 00–11' : 'Eftermiddag / kväll · 12–23');
  $('live').hidden = true;
  $('periodControl').hidden = task.mode === 'read';
  $('answerForm').hidden = task.mode !== 'read';
  $('hours').value = $('minutes').value = '';
  $('hours').disabled = $('minutes').disabled = false;
  $('check').hidden = $('hint').hidden = false;
  $('hint').textContent = 'Ledtråd';
  $('next').hidden = true;
  $('instruction').textContent = task.mode === 'read' ? 'Skriv timmar och minuter.' : minuteStep() === 5 ? 'Minutvisaren hoppar 5 minuter i taget. Timvisaren flyttas en timme i taget.' : 'Dra visarna. På den här nivån kan du ställa enskilda minuter.';
  feedback();
  time = task.mode === 'read' ? task.target : T.normalize(task.target + 130);
  render();
}
function markDone(correct) {
  done = true; drag = null;
  if (correct) session.solved++;
  if (!correct || attempts > 1 || assisted) session.missed.push({...task});
  $('check').hidden = $('hint').hidden = true;
  $('next').hidden = false;
  $('next').textContent = session.index === session.tasks.length - 1 ? 'Klart →' : 'Nästa →';
  $('hours').disabled = $('minutes').disabled = true;
  render();
}
function check() {
  if (done) return;
  const value = task.mode === 'read' ? T.parse($('hours').value.trim(), $('minutes').value.trim()) : time;
  if (value === null) { feedback('Skriv timmar 00–23 och minuter 00–59.'); return; }
  attempts++;
  if (value === task.target) {
    feedback(`Rätt! ${T.digital(task.target)} · ${T.words(task.target)}`, true);
    markDone(true);
  } else if (T.mod(value, 720) === T.mod(task.target, 720)) {
    feedback('Visarna är rätt. Välj 00–11 eller 12–23.');
  } else if (value % 60 === task.target % 60) {
    feedback('Minuterna är rätt. Flytta korta visaren.');
  } else feedback('Försök igen. Titta på långa visaren.');
}
$('check').onclick = check;
$('answerForm').onsubmit = e => { e.preventDefault(); check(); };
for (const id of ['hours', 'minutes']) $(id).onkeydown = e => {
  if (e.key === 'Enter') { e.preventDefault(); check(); }
};
$('hint').onclick = () => {
  assisted = true;
  const minute = task.target % 60;
  if (!hintShown) {
    const position = minute === 0 ? '12' : minute % 5 === 0 ? String(minute / 5) : `mellan ${Math.floor(minute / 5) || 12} och ${Math.floor(minute / 5) + 1}`;
    feedback(`Långa visaren: ${minute} minuter, ${minute % 5 ? '' : 'på '}${position}.`);
    $('showMinutes').checked = true; render();
    hintShown = true; $('hint').textContent = 'Visa svar';
  } else {
    const a = T.angles(task.target);
    $('ghostHour').setAttribute('transform', `rotate(${a.hour} 180 180)`);
    $('ghostMinute').setAttribute('transform', `rotate(${a.minute} 180 180)`);
    $('solution').removeAttribute('hidden');
    feedback(`${T.digital(task.target)} · ${T.words(task.target)}. Grönt visar svaret.`);
    markDone(false);
  }
};
$('next').onclick = () => {
  if (!done) return;
  if (++session.index < session.tasks.length) showTask();
  else {
    $('play').hidden = true; $('summary').hidden = false;
    $('resultText').textContent = `Du löste ${session.solved} av ${session.tasks.length} frågor.`;
    $('retry').hidden = !session.missed.length;
  }
};
$('practiceTab').onclick = () => showMode(false);
$('exploreTab').onclick = () => showMode(true);
$('again').onclick = () => showMode(false);
$('retry').onclick = () => start(shuffle(session.missed));
$('settingsButton').onclick = () => $('settings').showModal();
$('settings').addEventListener('close', () => {
  if ($('settings').returnValue !== 'apply') return;
  try { localStorage.setItem('vilja-clock-settings', JSON.stringify({mode: $('mode').value, level: Number($('level').value)})); } catch {}
  if (exploring) render(); else showMode(false);
});
// Use the visible viewport so controls stay above a mobile software keyboard.
function fitViewport() {
  const height = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
  document.body.classList.toggle('compact', height < 480);
}
window.visualViewport?.addEventListener('resize', fitViewport);
window.addEventListener('resize', fitViewport);
fitViewport(); showMode(false);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js').catch(() => {});
