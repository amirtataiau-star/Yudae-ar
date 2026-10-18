import assert from 'node:assert/strict';
import {fresh,restore,act,canTransfer,consequences} from './engine.mjs';
for(const p of ['clinic','shuttle','commons'])for(const c of ['public','targeted']){
 let s=fresh();s=act(s,'priority',p);s=act(s,'coordinate',c);assert.equal(s.priority,p);assert.equal(s.coordination,c);assert.equal(consequences(s).length,4);assert.deepEqual(restore(JSON.parse(JSON.stringify(s))),s);
 const changed=act(s,'priority',p==='clinic'?'shuttle':'clinic');assert.equal(changed.coordination,null);assert.equal(s.coordination,c);assert.equal(changed.history.length,3);
}
let s=fresh();s=act(s,'transfer','yes');assert.equal(s.transfer,false);s=act(s,'coordinate','public');assert.equal(s.coordination,null);s=act(s,'followup','solar');assert.equal(s.followup,null);
s=act(s,'ask','logger');assert(!canTransfer(s));s=act(s,'ask','route');assert(canTransfer(s));s=act(s,'transfer','yes');assert(s.transfer);
s=act(s,'ask','contacts');s=act(s,'followup','reach');assert.equal(s.followup,'reach');s=act(s,'ask','solar');s=act(s,'followup','solar');assert.equal(s.followup,'solar');s=act(s,'followup','none');assert.equal(s.followup,null);
s=act(s,'priority','clinic');s=act(s,'coordinate','public');assert(consequences(s).some(r=>r.text.includes('transport confirmation remains pending')));s=act(s,'priority','shuttle');assert(consequences(s).some(r=>r.text.includes('No supplies have moved')));assert(s.asked.includes('logger'));
assert.deepEqual(restore({version:5,asked:['bogus'],transfer:true,followup:'solar',priority:'unknown',coordination:'public'}),fresh());
console.log('PASS: six decision pathways; independent states; revision preserves evidence and resets communication; prerequisites; exclusive follow-ups; conditional transfer; persistence and invalid-state recovery.');
