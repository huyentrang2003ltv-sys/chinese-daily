#!/usr/bin/env node
// Static sanity checks for the frontend (run with `npm run check`):
//  1. every script referenced by index.html exists and parses;
//  2. every function called from an inline handler (onclick="fn(...)") is defined;
//  3. no top-level name is declared twice across the classic scripts (they share one scope).
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PUBLIC = path.join(__dirname, '..', 'public');
const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
const errors = [];

const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
  .map(m => m[1])
  .filter(src => !/^https?:/.test(src));

const sources = {};
for (const src of scripts) {
  const file = path.join(PUBLIC, src.split('?')[0]);
  if (!fs.existsSync(file)) {
    errors.push(`Missing script: ${src}`);
    continue;
  }
  const code = fs.readFileSync(file, 'utf8');
  try {
    new vm.Script(code, { filename: src });
  } catch (e) {
    errors.push(`Syntax error in ${src}: ${e.message}`);
  }
  sources[src] = code;
}

// Top-level declarations per file
const declared = new Map();
const declRe = /^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:let|const|var)\s+([A-Za-z_$][\w$]*)/gm;
for (const [src, code] of Object.entries(sources)) {
  for (const m of code.matchAll(declRe)) {
    const name = m[1] || m[2];
    if (declared.has(name)) errors.push(`"${name}" declared in both ${declared.get(name)} and ${src}`);
    else declared.set(name, src);
  }
}

// Functions called from inline handlers in HTML and in JS template strings
const BUILTINS = new Set(['event', 'this', 'window', 'document', 'if', 'return', 'decodeURIComponent', 'encodeURIComponent', 'setTimeout']);
const handlerRe = /\bon(?:click|change|input|keydown|keyup|submit)="([^"]*)"/g;
const callRe = /(?:^|[;\s(!])([A-Za-z_$][\w$]*)\s*\(/g;
const allText = [html, ...Object.values(sources)].join('\n');
const called = new Set();
for (const m of allText.matchAll(handlerRe)) {
  // Drop ${...} interpolations so their contents are not mistaken for handler calls.
  const body = m[1].replace(/\$\{[^}]*\}/g, '0');
  for (const c of body.matchAll(callRe)) {
    if (!BUILTINS.has(c[1])) called.add(c[1]);
  }
}
for (const name of called) {
  if (!declared.has(name)) errors.push(`Inline handler calls undefined function: ${name}()`);
}

if (errors.length) {
  console.error(`✗ Frontend check failed (${errors.length}):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log(`✓ Frontend check passed: ${scripts.length} scripts, ${declared.size} top-level names, ${called.size} handler functions.`);
