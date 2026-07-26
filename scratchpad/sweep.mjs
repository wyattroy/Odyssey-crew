#!/usr/bin/env node
// scratchpad/sweep.mjs — balance characterization sweep (BALANCE-02 measurement tool).
// Runs N 0-human seeded games headlessly and reports survival + favor distribution.
// Reuses harness.mjs's DOM-stub + vm loader approach. Dev-only; never shipped.
// Usage: node scratchpad/sweep.mjs [N] [--assert]
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const args = process.argv.slice(2);
const ASSERT = args.includes('--assert');
const N = parseInt(args.find(a => a !== '--assert') || '40', 10);

// TARGETS — the D-09 balance acceptance bar (03-01 Task 1c). NOT a gate for 03-01
// itself (the post-tracer sweep is recorded as a baseline, not asserted against);
// 03-07's balance retune is the plan that must clear all of these via --assert.
const TARGETS = {
  noWinner: 0,
  errors: 0,
  allDeadPct: 10,          // allDeadPct <= 10
  meanSurvivors: 2.5,      // meanSurvivors >= 2.5
  seedsWithADeathPct: 20,  // seedsWithADeathPct >= 20 (real pressure survives — not trivial)
  distinctWinnerFavors: 5, // distinctWinnerFavors >= 5 (favor stays contested)
  // greedyAliveRate >= piousAliveRate (defection survives) — checked directly, no scalar target
  // piousAvgFavor > greedyAvgFavor (cooperation wins) — checked directly, no scalar target
};

const registry = new Map();
function makeElement(tag){const n={_tag:(tag||'div').toLowerCase(),children:[],childNodes:[],style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},dataset:{},value:'',checked:false,disabled:false,title:'',placeholder:'',className:'',scrollTop:0,scrollHeight:0,_innerHTML:'',_id:'',get id(){return this._id},set id(v){this._id=v;if(v)registry.set(v,this)},get innerHTML(){return this._innerHTML},set innerHTML(v){this._innerHTML=v;this.children=[];this.childNodes=[]},get textContent(){return this._innerHTML},set textContent(v){this._innerHTML=String(v)},appendChild(c){this.children.push(c);this.childNodes.push(c);return c},removeChild(c){this.children=this.children.filter(x=>x!==c);this.childNodes=this.childNodes.filter(x=>x!==c);return c},addEventListener(){},removeEventListener(){},querySelector(){return makeElement('div')},querySelectorAll(){return[]},setAttribute(){},getAttribute(){return null},removeAttribute(){},focus(){},blur(){},click(){if(typeof this.onclick==='function')this.onclick()}};return n}
const documentStub={getElementById(id){if(!registry.has(id))registry.set(id,makeElement('div'));return registry.get(id)},createElement(t){return makeElement(t)}};
const html=fs.readFileSync(INDEX_PATH,'utf8');
const scriptBody=html.match(/<script>([\s\S]*?)<\/script>/)[1];

async function runSeed(seed){
  registry.clear();
  const sandbox={document:documentStub,location:{search:'',reload(){}},console:{log(){},warn(){},error(){}},URLSearchParams,setTimeout,clearTimeout,Math};
  const context=vm.createContext(sandbox);
  new vm.Script(scriptBody,{filename:'idx'}).runInContext(context);
  sandbox.__seed=seed;
  const runner=new vm.Script(`(async()=>{
    const opts={humanCount:0,seed:__seed,directorMode:true,botSpeed:0,names:['P1','P2','P3','P4'],isBot:[true,true,true,true],temperament:['greedy','balanced','pious','balanced']};
    state=newState(opts); render();
    try{await runGame();}catch(e){return {err:e.message}}
    const players=state.players.map(p=>({t:p.temperament,favor:p.favor,dead:p.status==='dead'}));
    const deaths = state.log.filter(e=>e.cls==='l-die').length;
    const winnerNamed = state.log.some(e=>String(e.html).includes('THE VERDICT'));
    return {over:state.over, players, deaths, winnerNamed};
  })()`,{filename:'run'});
  return await runner.runInContext(context);
}

const seeds=Array.from({length:N},(_,i)=>'sweep-'+i);
const rows=[];
for(const s of seeds){ rows.push({seed:s, ...(await runSeed(s))}); }

let allDead=0, someAlive=0, fullCrew=0, errs=0, incomplete=0, noWinner=0, seedsWithADeath=0;
const survDist={0:0,1:0,2:0,3:0,4:0};
const winnerFavors=[]; const survivorCounts=[];
const byTemp={greedy:{alive:0,n:0,favorSum:0},balanced:{alive:0,n:0,favorSum:0},pious:{alive:0,n:0,favorSum:0}};
for(const r of rows){
  if(r.err){errs++;continue;}
  if(!r.over){incomplete++;continue;}
  const surv=r.players.filter(p=>!p.dead).length;
  survDist[surv]++;
  survivorCounts.push(surv);
  if(surv===0)allDead++; else someAlive++;
  if(surv===4)fullCrew++;
  if(r.deaths>0) seedsWithADeath++;
  if(!r.winnerNamed) noWinner++;
  const pool = r.players.filter(p=>!p.dead); const cand = pool.length?pool:r.players;
  winnerFavors.push(Math.max(...cand.map(p=>p.favor)));
  r.players.forEach(p=>{const b=byTemp[p.t]; if(b){b.n++; if(!p.dead)b.alive++; b.favorSum+=p.favor;}});
}
const n=rows.length-errs-incomplete;
const pct=x=>((100*x/n)||0).toFixed(0)+'%';
const pctNum=x=>((100*x/n)||0);
const avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length):0;
const avgStr=a=>a.length?avg(a).toFixed(1):'-';

console.log(`\n=== BALANCE SWEEP: ${n} seeds (0-human auto) ===`);
console.log(`errors/incomplete: ${errs+incomplete}${incomplete?` (incomplete: ${incomplete})`:''}`);
console.log(`no-winner / incomplete: ${noWinner}`);
console.log(`ALL-DEAD (death-spiral): ${allDead} (${pct(allDead)})`);
console.log(`≥1 survivor (reached Ithaca alive): ${someAlive} (${pct(someAlive)})`);
console.log(`full crew (4) survived: ${fullCrew} (${pct(fullCrew)})`);
console.log(`survivor-count distribution:`, JSON.stringify(survDist));
console.log(`mean survivors: ${avgStr(survivorCounts)}`);
console.log(`seeds with ≥1 death: ${seedsWithADeath} (${pct(seedsWithADeath)})`);
console.log(`winner favor — min/avg/max: ${winnerFavors.length?Math.min(...winnerFavors):'-'}/${avgStr(winnerFavors)}/${winnerFavors.length?Math.max(...winnerFavors):'-'}`);
const distinctFavors = [...new Set(winnerFavors)].sort((a,b)=>a-b);
console.log(`favor spread (distinct winner favors): ${distinctFavors.join(',')} (${distinctFavors.length} distinct)`);
console.log(`by temperament (alive-rate | avg favor):`);
for(const t of ['greedy','balanced','pious']){const b=byTemp[t]; console.log(`  ${t}: ${b.n?((100*b.alive/b.n).toFixed(0)+'%'):'-'} alive | favor ${b.n?(b.favorSum/b.n).toFixed(1):'-'}`);}

if(ASSERT){
  const greedyAliveRate = byTemp.greedy.n ? byTemp.greedy.alive/byTemp.greedy.n : 0;
  const piousAliveRate = byTemp.pious.n ? byTemp.pious.alive/byTemp.pious.n : 0;
  const greedyAvgFavor = byTemp.greedy.n ? byTemp.greedy.favorSum/byTemp.greedy.n : 0;
  const piousAvgFavor = byTemp.pious.n ? byTemp.pious.favorSum/byTemp.pious.n : 0;
  const unmet=[];
  if(!(noWinner === TARGETS.noWinner)) unmet.push(`noWinner: got ${noWinner}, want === ${TARGETS.noWinner}`);
  if(!((errs+incomplete) === TARGETS.errors)) unmet.push(`errors: got ${errs+incomplete}, want === ${TARGETS.errors}`);
  if(!(pctNum(allDead) <= TARGETS.allDeadPct)) unmet.push(`allDeadPct: got ${pctNum(allDead).toFixed(1)}, want <= ${TARGETS.allDeadPct}`);
  if(!(avg(survivorCounts) >= TARGETS.meanSurvivors)) unmet.push(`meanSurvivors: got ${avg(survivorCounts).toFixed(2)}, want >= ${TARGETS.meanSurvivors}`);
  if(!(pctNum(seedsWithADeath) >= TARGETS.seedsWithADeathPct)) unmet.push(`seedsWithADeathPct: got ${pctNum(seedsWithADeath).toFixed(1)}, want >= ${TARGETS.seedsWithADeathPct}`);
  if(!(distinctFavors.length >= TARGETS.distinctWinnerFavors)) unmet.push(`distinctWinnerFavors: got ${distinctFavors.length}, want >= ${TARGETS.distinctWinnerFavors}`);
  if(!(greedyAliveRate >= piousAliveRate)) unmet.push(`greedyAliveRate (${(greedyAliveRate*100).toFixed(0)}%) >= piousAliveRate (${(piousAliveRate*100).toFixed(0)}%): FAILED — defection should survive at least as often as piety`);
  if(!(piousAvgFavor > greedyAvgFavor)) unmet.push(`piousAvgFavor (${piousAvgFavor.toFixed(1)}) > greedyAvgFavor (${greedyAvgFavor.toFixed(1)}): FAILED — cooperation should win favor`);

  console.log(`\n=== --assert: D-09 acceptance targets ===`);
  if(unmet.length){
    console.log(`FAIL — ${unmet.length} unmet target(s):`);
    unmet.forEach(u=>console.log(`  - ${u}`));
    process.exit(1);
  }
  console.log('PASS — all D-09 targets met.');
  process.exit(0);
}
