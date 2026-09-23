/**
 * Assembles the self-contained direction showcase from its parts.
 *   node design/build.js
 *
 * Why a build step: the artifact viewer blocks every external request, so fonts and the
 * logo must be inlined. Editing one 300KB file by hand is miserable; editing the parts
 * and re-running this is not.
 *
 * Parts (all in design/):
 *   _base.part.html   <title> + design tokens for all three directions  (has /*FONTS_PLACEHOLDER* /)
 *   _fonts.css        @font-face rules, woff2 embedded as base64
 *   _components.css   component styles, driven entirely by tokens
 *   _body.html        page markup
 *   _script.html      switcher, live contrast maths, tabs           (has "/*LOGO_SVG* /")
 *   _logo.clean.svg   the real logo, fill forced to currentColor
 *
 * Output: direction-showcase.html
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

let base = read('_base.part.html');
let script = read('_script.html');

const FONT_SLOT = '/*FONTS_PLACEHOLDER*/';
const LOGO_SLOT = '"/*LOGO_SVG*/"';
if (!base.includes(FONT_SLOT)) throw new Error('font placeholder missing from _base.part.html');
if (!script.includes(LOGO_SLOT)) throw new Error('logo placeholder missing from _script.html');

base = base.replace(FONT_SLOT, read('_fonts.css'));
script = script.replace(LOGO_SLOT, JSON.stringify(read('_logo.clean.svg')));

const out = [base, read('_components.css'), read('_body.html'), script].join('\n');
fs.writeFileSync(path.join(dir, 'direction-showcase.html'), out);

// Guard rails. These are cheap and each one has already caught a real bug.
const problems = [];
if (!/<title>/.test(out)) problems.push('no <title>');
if (/<html|<body|<!DOCTYPE/i.test(out)) problems.push('contains html/body/doctype (the artifact supplies these)');
if (/PLACEHOLDER|LOGO_SVG/.test(out)) problems.push('unresolved placeholder');
if (/(src|href)=["']https?:/i.test(out)) problems.push('external resource reference');
// The artifact <head> is not ours, so we cannot set a charset. Anything non-ASCII would
// be decoded as windows-1252 and render as mojibake. Entities and \u escapes only.
const nonAscii = [...out].filter((c) => c.codePointAt(0) > 126);
if (nonAscii.length) problems.push(`${nonAscii.length} non-ASCII bytes (use HTML entities / \\u escapes)`);

if (problems.length) {
  problems.forEach((p) => console.error('  FAIL  ' + p));
  process.exit(1);
}
console.log(`built direction-showcase.html  ${Math.round(out.length / 1024)}KB  ASCII-clean, self-contained`);
