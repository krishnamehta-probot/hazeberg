# Use-case card images — generation prompts

Three images, for the three use-case cards on the home page.

| Card | Title | File to save as |
|---|---|---|
| 01 | Modernizing HR Operations with Workday HCM | `web/public/cases/01-hr-operations.jpg` |
| 02 | Streamlining Global Workforce Management with Workday HCM & Payroll | `web/public/cases/02-global-workforce.jpg` |
| 03 | Driving Financial Visibility with Workday Finance | `web/public/cases/03-financial-visibility.jpg` |

**Technical requirements — all three**

- **Aspect ratio 16:9**, generated at **2400 × 1350 px** minimum. The card crops to
  `aspect-[16/9]` with `object-cover`, and renders up to ~400px wide on desktop and
  full-width on a phone, so this is a 2x file with headroom.
- **Keep the top-left corner quiet.** A `USE CASE 01` pill sits there — a dark
  translucent chip, ~110 × 24px inset 12px. It has its own background, so it is
  legible over anything, but a face or a hard edge directly under it looks like a
  mistake.
- **The subject should sit right of centre or centred**, never top-left.
- Save as JPEG, quality 82–86.

**Why the style rules below are not negotiable** — they are the project's
photography direction (`PROJECT-RULES.md`, rule 8), and the three cards sit in one
row where any mismatch is visible immediately.

---

## The house style block

Prepend this to all three prompts. It is what makes the three read as one
photographer's set rather than three stock picks.

```
Photorealistic editorial photograph, shot on a full-frame camera with a 35mm lens
at f/2.8. Bright, natural daylight from large windows — soft, directional, no
harsh shadows, no artificial colour cast. A real modern workplace: white and pale
grey surfaces, light wood, glass partitions, matte black fittings.

Colour palette strictly neutral and desaturated: white, cool grey, pale oak,
charcoal, navy. NO saturated colour anywhere — no red, orange, rust, lush green,
teal, or purple in the clothing, furniture, walls or props.

People are working, unaware of the camera. NOBODY LOOKS AT THE LENS. Candid,
mid-action, natural posture — not posed, not smiling at each other, not shaking
hands, not applauding.

Clean, restrained composition with real negative space. Shallow depth of field so
the background falls away softly. Natural film grain, true-to-life skin tones,
neutral white balance. Documentary rather than advertising.
```

## The negative block

Append this to all three.

```
No text, no lettering, no logos, no brand marks, no signage, no readable screen
content, no charts or dashboards with legible numbers. No watermark. No 3D render,
no CGI, no illustration, no digital art, no AI-looking gloss. No fisheye, no
extreme wide angle, no tilt-shift. No eye contact with the camera. No stock-photo
handshake, no group thumbs-up, no pointing at a whiteboard covered in sticky
notes, no laughing around a laptop. No teal-and-orange grade, no heavy vignette,
no HDR. No plastic skin, no extra fingers, no malformed hands. No crowded frame.
```

---

## 01 — Modernizing HR Operations with Workday HCM

The story is a fragmented, manual HR function becoming one clean system. What that
looks like is two people concentrating together on one screen, in a calm room —
not a crowd.

```
[HOUSE STYLE BLOCK]

Subject: two colleagues standing side by side at a height-adjustable desk in a
bright open-plan office, both looking down at a single monitor. One is mid-gesture
towards the screen, the other has a notebook resting on the desk. The monitor's
content is out of focus and unreadable. Seen from slightly behind and to the left,
at chest height, so neither face is towards the camera.

Setting: white desk, pale oak floor, a glass partition behind them with an empty
meeting room beyond it. A tall window on the left throws soft daylight across the
desk. Background figures are distant and blurred.

Wardrobe: charcoal knit and a white shirt; one wears navy. Simple, modern,
unbranded.

Framing: horizontal 16:9. The pair sits right of centre. The left third is quiet —
empty desk surface and window light.

Mood: focused, quiet, ordinary competence. Mid-morning.

[NEGATIVE BLOCK]
```

**Midjourney one-liner**

```
candid editorial photograph, two colleagues at a standing desk in a bright
open-plan office looking down at one monitor, seen from behind and to the side, no
faces to camera, screen out of focus, glass partition and pale oak floor, large
window daylight from the left, neutral desaturated palette of white grey oak
charcoal navy, 35mm f/2.8, shallow depth of field, natural grain, documentary,
subject right of centre, empty quiet space on the left --ar 16:9 --style raw --v 7
```

---

## 02 — Streamlining Global Workforce Management with Workday HCM & Payroll

The story is many countries running one way. Say "global" with distance and
connection — a call across timezones — not with a world map or a row of flags.

```
[HOUSE STYLE BLOCK]

Subject: one person seated alone in a small glass-walled meeting room, on a video
call, laptop open in front of them and a large wall-mounted display to the side.
The call's participant grid is visible but entirely out of focus and unreadable —
no legible faces, no names, no interface text. They are half-turned away from the
camera, listening, one hand resting on the table.

Setting: the room is shot from outside through the glass wall, so the frame has a
soft foreground edge and a reflection of the office behind the camera. Late
afternoon daylight rakes in from a window beyond the room. Corridor and empty desks
beyond, deeply out of focus.

Wardrobe: pale grey shirt or a fine navy knit. Unbranded.

Framing: horizontal 16:9. The glazed room and figure occupy the right two thirds;
the left third is the glass edge and soft reflection, with no detail in it.

Mood: quiet coordination across distance. Early evening in one place, morning in
another.

[NEGATIVE BLOCK]
```

**Midjourney one-liner**

```
candid editorial photograph, a single person on a video call inside a small glass
meeting room, photographed from outside through the glass with soft reflections,
half-turned away, no eye contact, call grid on screen completely out of focus and
unreadable, empty desks and corridor blurred behind, raking late afternoon
daylight, neutral desaturated white grey navy palette, 35mm f/2.8, shallow depth
of field, natural grain, documentary, figure right of centre, quiet empty left
third --ar 16:9 --style raw --v 7
```

---

## 03 — Driving Financial Visibility with Workday Finance

The story is disconnected finance becoming one view. Visibility reads as light and
clarity, not as a wall of charts — and it must not be a screen full of graphs,
which is the single most generic finance image there is.

```
[HOUSE STYLE BLOCK]

Subject: one person seated at a long table in a bright, nearly empty meeting room,
reviewing a small stack of printed documents held flat on the table. A closed
laptop and a glass of water sit beside them. Head down, reading. Shot from across
the table at seated eye level, slightly to one side, so the face is in
three-quarter profile and turned away from the lens.

Setting: a full-height window fills the background, blown out to soft white —
bright but not glaring — with the city beyond reduced to pale shapes. The table is
pale oak, the chairs matte black. The room is otherwise empty.

Wardrobe: white shirt, sleeves rolled, or a charcoal fine-knit. Unbranded.

Framing: horizontal 16:9. The figure sits right of centre against the window; the
left half is the empty length of the table and the window's white light.

Mood: calm, unhurried concentration. Clear, even, morning light.

[NEGATIVE BLOCK]
```

**Midjourney one-liner**

```
candid editorial photograph, one person alone at a long pale oak table in a bright
empty meeting room, head down reading printed documents, three-quarter profile
turned away from camera, no eye contact, closed laptop beside them, full-height
window behind blown out to soft white with the city as pale shapes, matte black
chairs, neutral desaturated palette, 35mm f/2.8, shallow depth of field, natural
grain, documentary, figure right of centre, empty table filling the left half
--ar 16:9 --style raw --v 7
```

---

## Generating them as a set

The three sit side by side in one row, so they have to match more than they have to
be individually good.

1. **Generate all three in one session, same model, same settings.** Do not come
   back a week later for the third one.
2. **Fix the seed** if the tool allows it, and vary only the subject paragraph.
3. **Check them as a row before accepting any of them.** Put the three side by
   side at card size (~400px wide) and look for: one image warmer or cooler than
   the others, one noticeably darker, one with a different depth of field, one
   whose subject sits at a different height in the frame.
4. **Reject any frame with legible text on a screen.** It is the fastest way an
   image dates itself, and the most common thing generators get wrong.
5. **Reject any frame where someone looks at the camera**, however good it is
   otherwise. That single rule is doing most of the work of keeping the set
   editorial rather than stock.

## Wiring them in

Save the three as above, then in `web/src/components/sections/home.tsx` replace:

```ts
cases: ["/comp/section-08.webp", "/comp/section-07.webp", "/comp/section-02.webp"],
```

with:

```ts
cases: [
  "/cases/01-hr-operations.jpg",
  "/cases/02-global-workforce.jpg",
  "/cases/03-financial-visibility.jpg",
],
```

The card's `alt` is currently `""` — decorative, because the card's own heading
already names the use case. If the final images carry meaning of their own, give
each one a real `alt` at the same time.
