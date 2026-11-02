/* Shared clock arithmetic. One minute value drives both hands. */
(function(root){
  const mod=(n,m)=>((n%m)+m)%m;
  const normalize=n=>mod(Math.round(n),1440);
  const names=['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva'];
  function digital(t){t=normalize(t);return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;}
  function words(t){t=normalize(t);const h=Math.floor(t/60)%12,m=t%60,n=names[(h+1)%12];
    const phrases={0:`${names[h]}`,5:`fem över ${names[h]}`,10:`tio över ${names[h]}`,15:`kvart över ${names[h]}`,20:`tio i halv ${n}`,25:`fem i halv ${n}`,30:`halv ${n}`,35:`fem över halv ${n}`,40:`tio över halv ${n}`,45:`kvart i ${n}`,50:`tio i ${n}`,55:`fem i ${n}`};
    return phrases[m]||`${m} minuter över ${names[h]}`;
  }
  const period=t=>normalize(t)<720?'förmiddag/natt':'eftermiddag/kväll';
  function angles(t){t=normalize(t);return {minute:(t%60)*6,hour:(t%720)/2};}
  const delta=(from,to)=>mod(to-from+30,60)-30;
  function parse(h,m){if(!/^\d{1,2}$/.test(h)||!/^\d{1,2}$/.test(m))return null;h=Number(h);m=Number(m);return h<24&&m<60?h*60+m:null;}
  const api={mod,normalize,digital,words,period,angles,delta,parse};
  if(typeof module!=='undefined')module.exports=api;else root.ClockTime=api;
})(typeof window!=='undefined'?window:globalThis);
