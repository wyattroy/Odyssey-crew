#!/usr/bin/env node
// scratchpad/econcheck.mjs — structural economy gate (03-01 Task 1).
//
// Proves the two-verb, one-currency contract holds:
//   1. SOURCE SCAN: index.html's inline script, with comments/strings stripped, must
//      contain zero live occurrences of the retired identifiers `state.world`,
//      `state.curse`, `.world`, `d.world`, `worldToExtraBlue`, `boastCurse`, and the
//      retired verb key `give` (as an object key, a quoted string, or a property access).
//      Comment/prose stripping means a design note that MENTIONS a retired name never
//      fails the build — only live code can.
//   2. RUNTIME ASSERTIONS (fresh vm context, reusing harness.mjs's DOM-stub + vm loader):
//      VERBS === ['dare','abide']; DELTA_KEYS === ['you','crew','favor']; a fresh
//      newState() has no own `world`/`curse` property; LAND_TABLE/SEA_TABLE each declare
//      exactly the two verbs; every scene of every EPISODES entry (and ANCHORS, once it
//      exists) declares exactly the two verbs with all four faces {1,3,4,6}, and every
//      cell's `d`/`alwaysD` keys are inside DELTA_KEYS; validateBeats() returns {ok:true}.
//
// Exit 0 = the two-verb, one-currency contract holds. Exit 1 = per-failure diagnostic.
// Dev-only; never becomes a dependency of index.html.
// Usage: node scratchpad/econcheck.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

/* ---------------------------------------------------------------- DOM stub (harness.mjs pattern) --- */
const registry = new Map();
function makeElement(tag) {
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
    querySelector(){ return makeElement('div'); }, querySelectorAll(){ return []; },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    focus(){}, blur(){}, click(){ if (typeof this.onclick === 'function') this.onclick(); },
  };
  return node;
}
const documentStub = {
  getElementById(id){ if (!registry.has(id)) registry.set(id, makeElement('div')); return registry.get(id); },
  createElement(tag){ return makeElement(tag); },
};

function loadScriptBody() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('econcheck: could not find inline <script> in index.html');
  return m[1];
}

/* ---------------------------------------------------------------- 1. source scan --- */
// Strip line comments, block comments and string/template literals so only LIVE
// identifier references survive the scan (a prose mention in a comment or a `tell`
// sentence must never fail the build).
// stripComments(src): removes // and /* */ comments ONLY — string/template literal
// CONTENTS are left completely intact (this pass is used to find a live quoted 'give'
// string used as an actual value in code, which must NOT be blanked the way comment
// prose is).
function stripComments(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const quote = c; const start = i; i++;
      while (i < n && src[i] !== quote) { if (src[i] === '\\') i++; i++; }
      i++; // consume closing quote
      out += src.slice(start, i); // keep the string literal verbatim
      continue;
    }
    out += c; i++;
  }
  return out;
}
// stripCommentsAndStrings(src): comments AND string/template literal CONTENTS blanked —
// used for the exact-identifier checks (state.world, worldToExtraBlue, etc.) so a prose
// `tell()` sentence that happens to mention a retired name in flavor text never fails
// the build (Pitfall 10's whole point: only LIVE code can fail this gate).
function stripCommentsAndStrings(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      const quote = c; i++;
      while (i < n && src[i] !== quote) { if (src[i] === '\\') i++; i++; }
      i++; // consume closing quote
      out += ' '; // preserve token boundary without contributing text
      continue;
    }
    out += c; i++;
  }
  return out;
}

const RETIRED = ['state.world', 'state.curse', '.world', 'd.world', 'worldToExtraBlue', 'boastCurse'];

function sourceScan(scriptBody) {
  const stripped = stripCommentsAndStrings(scriptBody);
  const commentsOnlyStripped = stripComments(scriptBody);
  const failures = [];
  for (const ident of RETIRED) {
    // Word-boundary match (not a raw substring match): `.world` must NOT trip on a
    // legitimate identifier like `.worldPerListen` or `.worldStart` — only an exact
    // `.world` property access (end-of-identifier immediately after "world").
    const re = new RegExp(ident.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
    if (re.test(stripped)) {
      failures.push(`retired identifier still live in source: "${ident}"`);
    }
  }
  // retired verb key `give`: as an object key (give:) or a property access (.give) —
  // checked against the comments+strings-stripped source (these never legitimately
  // appear inside narrative string content).
  if (/\bgive\s*:/.test(stripped)) failures.push('retired verb key still live as an object key: "give:"');
  if (/\.give\b/.test(stripped)) failures.push('retired verb key still live as a property access: ".give"');
  // quoted 'give' / "give" as an actual VALUE in live code (e.g. verb==='give') — checked
  // against the comments-ONLY-stripped source (string literals preserved), so a comment
  // that merely mentions 'give' in prose can never trip this, but a real `==='give'`
  // comparison still does.
  if (/['"]give['"]/.test(commentsOnlyStripped)) failures.push('retired verb key still live as a quoted string: \'give\'/"give"');
  return failures;
}

/* ---------------------------------------------------------------- 2. runtime assertions --- */
async function runtimeAssertions(scriptBody) {
  const sandbox = {
    document: documentStub,
    location: { search: '', reload(){} },
    console, URLSearchParams, setTimeout, clearTimeout, Math,
  };
  const context = vm.createContext(sandbox);
  new vm.Script(scriptBody, { filename: 'index.html#inline-script' }).runInContext(context);

  const runner = new vm.Script(
    `(() => {
      const out = { failures: [], scenesChecked: 0, cellsChecked: 0 };
      const fail = (msg) => out.failures.push(msg);

      // VERBS / DELTA_KEYS
      if (typeof VERBS === 'undefined') fail('VERBS is not defined');
      else if (JSON.stringify(VERBS) !== JSON.stringify(['dare','abide'])) fail('VERBS is not exactly [\\'dare\\',\\'abide\\'] — got ' + JSON.stringify(VERBS));
      if (typeof DELTA_KEYS === 'undefined') fail('DELTA_KEYS is not defined');
      else if (JSON.stringify(DELTA_KEYS) !== JSON.stringify(['you','crew','favor'])) fail('DELTA_KEYS is not exactly [\\'you\\',\\'crew\\',\\'favor\\'] — got ' + JSON.stringify(DELTA_KEYS));

      // newState() has no own world/curse
      try {
        const s = newState({ seed:'econcheck', humanCount:0, directorMode:true, botSpeed:0, names:['P1','P2','P3','P4'], isBot:[true,true,true,true], temperament:['greedy','balanced','pious','balanced'] });
        if (Object.prototype.hasOwnProperty.call(s, 'world')) fail('newState() still has an own "world" property');
        if (Object.prototype.hasOwnProperty.call(s, 'curse')) fail('newState() still has an own "curse" property');
      } catch (e) { fail('newState() threw: ' + e.message); }

      // LAND_TABLE / SEA_TABLE declare exactly two verbs
      const expectVerbs = (table, label) => {
        if (typeof table === 'undefined') { fail(label + ' is not defined'); return; }
        const keys = Object.keys(table).slice().sort();
        const want = (typeof VERBS !== 'undefined' ? VERBS.slice().sort() : ['abide','dare']);
        if (JSON.stringify(keys) !== JSON.stringify(want)) fail(label + ' declares verbs ' + JSON.stringify(keys) + ', expected exactly ' + JSON.stringify(want));
      };
      expectVerbs(LAND_TABLE, 'LAND_TABLE');
      expectVerbs(SEA_TABLE, 'SEA_TABLE');

      // every scene of every EPISODES entry (and ANCHORS, once it exists): exactly two
      // verbs, all four faces, only in-vocabulary payoff keys.
      const checkEpisodeSet = (obj, label) => {
        Object.values(obj).forEach(ep => {
          (ep.scenes || []).forEach(sc => {
            if (!sc.beats) return; // not-yet-converted scenes are legitimate (validateBeats says so too)
            out.scenesChecked++;
            const verbsDeclared = Object.keys(sc.beats).slice().sort();
            const verbsExpected = (typeof VERBS !== 'undefined' ? VERBS.slice().sort() : ['abide','dare']);
            if (JSON.stringify(verbsDeclared) !== JSON.stringify(verbsExpected)) {
              fail(label + ' ' + ep.id + ' / ' + sc.name + ': declares verbs ' + JSON.stringify(verbsDeclared) + ', expected exactly ' + JSON.stringify(verbsExpected));
            }
            Object.keys(sc.beats).forEach(verb => {
              const table = sc.beats[verb];
              [1,3,4,6].forEach(face => {
                const cell = table[face];
                if (!cell) { fail(label + ' ' + ep.id + ' / ' + sc.name + ' / ' + verb + ' / face ' + face + ': missing cell'); return; }
                out.cellsChecked++;
                ['d','alwaysD'].forEach(key => {
                  const obj2 = cell[key];
                  if (!obj2) return;
                  Object.keys(obj2).forEach(k => {
                    if (!DELTA_KEYS.includes(k)) fail(label + ' ' + ep.id + ' / ' + sc.name + ' / ' + verb + ' / face ' + face + ': ' + key + ' key "' + k + '" not in DELTA_KEYS');
                  });
                });
              });
            });
          });
        });
      };
      checkEpisodeSet(EPISODES, 'EPISODES');
      if (typeof ANCHORS !== 'undefined') checkEpisodeSet(ANCHORS, 'ANCHORS');

      // validateBeats() returns {ok:true}
      try {
        const r = validateBeats();
        if (!r || r.ok !== true) fail('validateBeats() did not return {ok:true} — got ' + JSON.stringify(r));
      } catch (e) { fail('validateBeats() threw: ' + e.message); }

      return out;
    })()`,
    { filename: 'econcheck-runner' }
  );
  return runner.runInContext(context);
}

async function main() {
  const scriptBody = loadScriptBody();
  const failures = [];

  const scanFailures = sourceScan(scriptBody);
  failures.push(...scanFailures);

  let runtimeOut = { failures: [], scenesChecked: 0, cellsChecked: 0 };
  try {
    runtimeOut = await runtimeAssertions(scriptBody);
  } catch (e) {
    failures.push('runtime assertions threw uncaught: ' + e.message);
  }
  failures.push(...runtimeOut.failures);

  if (failures.length) {
    console.error(`econcheck: FAIL (${failures.length} problem(s)):`);
    failures.forEach(f => console.error(`  - ${f}`));
    process.exit(1);
  }
  console.log(`econcheck: PASS — ${runtimeOut.scenesChecked} scene(s) / ${runtimeOut.cellsChecked} cell(s) checked. Two verbs, one currency, no live retired identifiers.`);
  process.exit(0);
}

main().catch(err => { console.error('econcheck: uncaught error', err); process.exit(1); });
