#!/usr/bin/env node
// scratchpad/parity.mjs — same-seed determinism gate (03-01 Task 1).
//
// Runs the SAME seed twice, each in a freshly created vm context (fresh DOM-stub
// registry, fresh sandbox), each with the identical 0-human options harness.mjs uses.
// Joins each run's state.log entries into one string and compares. Exit 0 on an exact
// match (proving ?seed= reproducibility survives); exit 1 on the first differing entry.
//
// Usage: node scratchpad/parity.mjs [--seed <name>]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

function parseArgs(argv) {
  const out = { seed: 'demo' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--seed') { out.seed = argv[i + 1]; i++; }
  }
  return out;
}

function makeElement(tag, registry) {
  const node = {
    _tag: (tag || 'div').toLowerCase(), children: [], childNodes: [], style: {},
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    dataset: {}, value: '', checked: false, disabled: false, title: '', placeholder: '',
    className: '', scrollTop: 0, scrollHeight: 0, _innerHTML: '', _id: '',
    get id(){ return this._id; }, set id(v){ this._id = v; if (v) registry.set(v, this); },
    get innerHTML(){ return this._innerHTML; }, set innerHTML(v){ this._innerHTML = v; this.children = []; this.childNodes = []; },
    get textContent(){ return this._innerHTML; }, set textContent(v){ this._innerHTML = String(v); },
    appendChild(child){ this.children.push(child); this.childNodes.push(child); return child; },
    removeChild(child){ this.children = this.children.filter(c => c !== child); this.childNodes = this.childNodes.filter(c => c !== child); return child; },
    addEventListener(){}, removeEventListener(){},
    querySelector(){ return makeElement('div', registry); }, querySelectorAll(){ return []; },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    focus(){}, blur(){}, click(){ if (typeof this.onclick === 'function') this.onclick(); },
  };
  return node;
}
function makeDocumentStub(registry) {
  return {
    getElementById(id){ if (!registry.has(id)) registry.set(id, makeElement('div', registry)); return registry.get(id); },
    createElement(tag){ return makeElement(tag, registry); },
  };
}

function loadScriptBody() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('parity: could not find inline <script> in index.html');
  return m[1];
}

async function runOnce(scriptBody, seed) {
  const registry = new Map();
  const sandbox = {
    document: makeDocumentStub(registry),
    location: { search: '', reload(){} },
    console: { log(){}, warn(){}, error(){} },
    URLSearchParams, setTimeout, clearTimeout, Math,
  };
  const context = vm.createContext(sandbox);
  new vm.Script(scriptBody, { filename: 'idx' }).runInContext(context);
  sandbox.__seed = seed;
  const runner = new vm.Script(
    `(async () => {
      const opts = {
        humanCount: 0, seed: __seed, directorMode: true, botSpeed: 0,
        names: ['P1','P2','P3','P4'], isBot: [true,true,true,true],
        temperament: ['greedy','balanced','pious','balanced'],
      };
      state = newState(opts);
      render();
      let errorMessage = null;
      try { await runGame(); } catch (e) { errorMessage = e.message; }
      return {
        errorMessage,
        over: state.over,
        logJoined: state.log.map(e => e.cls + '|' + e.html).join('\\n'),
      };
    })()`,
    { filename: 'parity-run' }
  );
  return runner.runInContext(context);
}

async function main() {
  const { seed } = parseArgs(process.argv.slice(2));
  const scriptBody = loadScriptBody();

  const a = await runOnce(scriptBody, seed);
  const b = await runOnce(scriptBody, seed);

  if (a.errorMessage || b.errorMessage) {
    console.error(`parity: FAIL — run threw. a.errorMessage=${a.errorMessage} b.errorMessage=${b.errorMessage}`);
    process.exit(1);
  }

  const aLines = a.logJoined.split('\n');
  const bLines = b.logJoined.split('\n');
  const maxLen = Math.max(aLines.length, bLines.length);
  for (let i = 0; i < maxLen; i++) {
    if (aLines[i] !== bLines[i]) {
      console.error(`parity: FAIL — seed=${seed} transcripts diverge at entry ${i}`);
      console.error(`  run A [${i}]: ${aLines[i]}`);
      console.error(`  run B [${i}]: ${bLines[i]}`);
      process.exit(1);
    }
  }

  console.log(`parity: seed=${seed} — ${aLines.length} log entries, identical across both runs.`);
  console.log('parity: PASS — ?seed= reproducibility holds.');
  process.exit(0);
}

main().catch(err => { console.error('parity: uncaught error', err); process.exit(1); });
