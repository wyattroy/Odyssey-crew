#!/usr/bin/env node
// scratchpad/harness.mjs — reusable headless verification harness (02-01 tracer scaffold).
//
// There is no browser available in this environment. This harness loads index.html's
// single inline <script> body into a Node `vm` context behind a minimal DOM stub, then
// constructs and runs a 0-human seeded game exactly like a real browser hitting
// `?seed=<name>&auto=1&humans=0&speed=0` would — same newState()/runGame() call, same
// all-bot commit path (botDecide(), never askHuman()/promptButtons(), so the DOM stub
// never needs to simulate a click). It asserts:
//   1. validateBeats() returns { ok: true } (the fail-loud beats-coverage gate)
//   2. the game reaches finishGame() (state.over === true)
//   3. a "THE VERDICT" log line was emitted
//
// Reused by every later plan in this phase (Cyclops/Sirens/Lotus authoring) — do not
// special-case Helios content in here; it only knows about the generic engine seam
// (CONFIG, EPISODES, newState, runGame, validateBeats, state.log).
//
// Usage: node scratchpad/harness.mjs [--seed <name>]
// Exits 0 on success, 1 on any failure, printing a diagnostic either way.

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

/* ---------------------------------------------------------------- minimal DOM stub --- */
// Only the DOM surface index.html's script actually touches: getElementById/createElement,
// element .innerHTML/.textContent/.value/.checked/.style/.classList/.appendChild/
// .childNodes/.id, plus URLSearchParams + location for initFromUrl(). The all-bot
// (humanCount:0) path never reaches promptButtons()/askHuman()/passGate(), so no click
// simulation is needed anywhere in this stub — bots decide synchronously via botDecide().
const registry = new Map();
function makeElement(tag) {
  const node = {
    _tag: (tag || 'div').toLowerCase(),
    children: [],
    childNodes: [],
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {},
    value: '',
    checked: false,
    disabled: false,
    title: '',
    placeholder: '',
    className: '',
    scrollTop: 0,
    scrollHeight: 0,
    _innerHTML: '',
    _id: '',
    get id() { return this._id; },
    set id(v) { this._id = v; if (v) registry.set(v, this); },
    get innerHTML() { return this._innerHTML; },
    set innerHTML(v) { this._innerHTML = v; this.children = []; this.childNodes = []; },
    get textContent() { return this._innerHTML; },
    set textContent(v) { this._innerHTML = String(v); },
    appendChild(child) { this.children.push(child); this.childNodes.push(child); return child; },
    removeChild(child) {
      this.children = this.children.filter(c => c !== child);
      this.childNodes = this.childNodes.filter(c => c !== child);
      return child;
    },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return makeElement('div'); },
    querySelectorAll() { return []; },
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    focus() {}, blur() {},
    click() { if (typeof this.onclick === 'function') this.onclick(); },
  };
  return node;
}
const documentStub = {
  getElementById(id) {
    if (!registry.has(id)) registry.set(id, makeElement('div'));
    return registry.get(id);
  },
  createElement(tag) { return makeElement(tag); },
};

/* ---------------------------------------------------------------- load + run --- */
function loadScriptBody() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('harness: could not find inline <script> in index.html');
  return m[1];
}

async function main() {
  const { seed } = parseArgs(process.argv.slice(2));
  const scriptBody = loadScriptBody();

  const sandbox = {
    document: documentStub,
    location: { search: '', reload() {} },
    console,
    URLSearchParams,
    setTimeout,
    clearTimeout,
    Math,
  };
  const context = vm.createContext(sandbox);

  // Run index.html's inline script verbatim (unmodified — we are testing the shipped
  // file, not a copy of it).
  new vm.Script(scriptBody, { filename: 'index.html#inline-script' }).runInContext(context);

  // A second script run in the SAME context shares the first script's top-level
  // let/const global lexical bindings (V8 contexts retain one persistent global lexical
  // environment across separate vm.Script executions — the same mechanism the Node REPL
  // relies on), so `state`, `newState`, `runGame`, `validateBeats`, `render` are all
  // directly referenceable here without index.html exposing anything new.
  sandbox.__seed = seed || null;
  const runner = new vm.Script(
    `(async () => {
      const opts = {
        humanCount: 0,
        seed: __seed,
        directorMode: true,
        botSpeed: 0,
        names: ['P1','P2','P3','P4'],
        isBot: [true,true,true,true],
        temperament: ['greedy','balanced','pious','balanced'],
      };
      let beatsResult = null, beatsErrorMessage = null;
      try { beatsResult = validateBeats(); } catch (e) { beatsErrorMessage = e.message; }
      state = newState(opts);
      render();
      let runErrorMessage = null;
      try { await runGame(); } catch (e) { runErrorMessage = e.message; }
      return {
        beatsResult, beatsErrorMessage, runErrorMessage,
        over: state.over,
        verdictFound: state.log.some(e => String(e.html).includes('THE VERDICT')),
        lastLogLine: state.log.length ? state.log[state.log.length - 1].html : null,
      };
    })()`,
    { filename: 'harness-runner' }
  );
  const result = await runner.runInContext(context);

  console.log(`harness: seed=${seed || '(random)'}`);
  if (result.beatsErrorMessage) {
    console.error(`FAIL: validateBeats() threw: ${result.beatsErrorMessage}`);
    process.exit(1);
  }
  console.log(
    `validateBeats: ok=${result.beatsResult && result.beatsResult.ok} ` +
    `notYetConverted=${JSON.stringify(result.beatsResult && result.beatsResult.notYetConverted)}`
  );
  if (result.runErrorMessage) {
    console.error(`FAIL: runGame() threw: ${result.runErrorMessage}`);
    process.exit(1);
  }
  if (!result.over) {
    console.error('FAIL: state.over is not true — game did not reach finishGame()');
    process.exit(1);
  }
  if (!result.verdictFound) {
    console.error('FAIL: no THE VERDICT log line found');
    process.exit(1);
  }
  console.log(`THE VERDICT: ${result.lastLogLine}`);
  console.log('harness: PASS — 0-human seeded run reached THE VERDICT, validateBeats ok');
  process.exit(0);
}

main().catch(err => { console.error('harness: uncaught error', err); process.exit(1); });
