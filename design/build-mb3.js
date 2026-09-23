/**
 * Assembles the one-page Hazeberg moodboard poster.
 *   node design/build-mb3.js
 *
 * The artifact viewer blocks every external request, so the typeface and the logo are
 * inlined. Photography is left as numbered slots the client fills from their own files.
 *   _mb3.css         <title> + tokens + layout        (slot /*MB3_FONTS* /)
 *   _mb2-fonts.css   Work Sans variable, base64 woff2
 *   _mb3-body.html   the collage
 *   _mb3-script.html logo injection + drop-to-fill    (slot "/*MB3_LOGO* /")
 *   _logo.clean.svg  logo, fill forced to currentColor
 *
 * Output: moodboard.html
 */
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');

let css = read('_mb3.css');
let script = read('_mb3-script.html');

for (const [src, slot, name] of [
  [css, '/*MB3_FONTS*/', '_mb3.css'],
  [script, '"/*MB3_LOGO*/"', '_mb3-script.html'],
]) if (!src.includes(slot)) throw new Error(`slot ${slot} missing from ${name}`);

css = css.replace('/*MB3_FONTS*/', read('_mb2-fonts.css'));
script = script.replace('"/*MB3_LOGO*/"', JSON.stringify(read('_logo.clean.svg')));

const out = [css, read('_mb3-body.html'), script].join('\n');
fs.writeFileSync(path.join(dir, 'moodboard.html'), out);

const problems = [];
if (!/<title>/.test(out)) problems.push('no <title>');
if (/<html|<body|<!DOCTYPE/i.test(out)) problems.push('contains html/body/doctype (the artifact supplies these)');
if (/MB3_FONTS|MB3_LOGO/.test(out)) problems.push('unresolved slot');
if (/(src|href)=["']https?:/i.test(out)) problems.push('external resource reference');
// The artifact <head> is not ours, so non-ASCII risks decoding as windows-1252.
const nonAscii = [...out].filter((c) => c.codePointAt(0) > 126);
if (nonAscii.length) problems.push(`${nonAscii.length} non-ASCII bytes (use HTML entities)`);

if (problems.length) { problems.forEach((p) => console.error('  FAIL  ' + p)); process.exit(1); }
console.log(`built moodboard.html  ${Math.round(out.length / 1024)}KB  ASCII-clean, self-contained`);
