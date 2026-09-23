# Hero artwork

`meeting.png` — the home page hero. Supplied by the client, 2026-09-16.

Four colleagues in conversation around a meeting table; warm neutral palette,
natural light, shallow depth of field.

The hero crops this to roughly 2.3:1 with `object-position: 50% 35%`, which
keeps the faces in frame and lets the table foreground fall away. The bottom
right is deliberately expendable — the yellow notch block sits on it.

If this file is absent the hero falls back to the ink gradient behind it, which
is intentionally the harshest case the white headline has to survive. Run
`npm run qa:header` after replacing it: the contrast check photographs the
actual pixels behind the headline at both 1440 and 390, so it measures the real
image, not a guess.

## Outstanding: resolution

The current file is **1200 x 900**, and the hero is full-bleed:

| viewport | DPR | slot        | upscale |
|----------|-----|-------------|---------|
| 1440     | 1   | 1400px      | 1.17x   |
| 1440     | 2   | 2800px      | 2.33x   |
| 1920+    | 2   | 2992px      | 2.49x   |

So on any retina display the hero is being blown up ~2.4x and reads soft. The
shallow depth of field hides some of it, but the concrete wall and the curtain
show it clearly.

**Ask the client for at least 2400 x 1800; 3000 x 2250 is better.** No code
change is needed — drop the bigger file in and Next will serve the right size.

Format: a PNG of a photograph is the wrong container (this one is 1.17 MB).
Next converts to WebP/AVIF on delivery so visitors are unaffected, but the
final asset should land here as a JPEG.
