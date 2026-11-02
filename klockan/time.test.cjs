const {test}=require('node:test');
const assert=require('node:assert/strict');
const T=require('./time.js');
test('every minute has consistent 24-hour notation and mechanically linked hands',()=>{
 for(let t=0;t<1440;t++){
  const [h,m]=T.digital(t).split(':');assert.equal(T.parse(h,m),t);
  const a=T.angles(t);assert.equal(a.minute,Number(m)*6);assert.equal(a.hour,(Number(h)%12)*30+Number(m)/2);
 }
});
test('Swedish expressions refer to the correct next hour, including midnight',()=>{
 const expected=['ett','fem över ett','tio över ett','kvart över ett','tio i halv två','fem i halv två','halv två','fem över halv två','tio över halv två','kvart i två','tio i två','fem i två'];
 expected.forEach((s,i)=>assert.equal(T.words(13*60+i*5),s));
 assert.equal(T.words(23*60+30),'halv tolv');assert.equal(T.words(23*60+55),'fem i tolv');assert.equal(T.words(0),'tolv');
});
test('drags cross twelve in either direction without jumping an hour',()=>{
 assert.equal(T.delta(59,1),2);assert.equal(T.delta(1,59),-2);
 assert.equal(T.normalize(1439+T.delta(59,1)),1);assert.equal(T.normalize(0+T.delta(1,59)),1438);
 assert.equal(T.digital(-1),'23:59');assert.equal(T.digital(1440),'00:00');
});
test('digital answers reject impossible or partial times',()=>{
 for(const [h,m] of [['24','00'],['12','60'],['-1','15'],['1x','00'],['','30'],['13',''],['1.5','30']])assert.equal(T.parse(h,m),null);
 assert.equal(T.parse('00','00'),0);assert.equal(T.parse('23','59'),1439);
});
