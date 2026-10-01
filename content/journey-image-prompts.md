# What we do: four journey images

Four photographs for the "Wherever you are with Workday" section of `/what-we-do`, one for each situation a visitor can pick. They replace the stand-in stock photos in that section.

The four must look like **one set**: same office, same daylight, same colour grade.

---

## Output

| # | Situation | Save as |
|---|---|---|
| 1 | Planning Workday | `web/public/journey/01-planning.jpg` |
| 2 | Recently Gone Live | `web/public/journey/02-live.jpg` |
| 3 | Maximizing an Existing Workday Environment | `web/public/journey/03-maximising.jpg` |
| 4 | Connecting Your Enterprise | `web/public/journey/04-connecting.jpg` |

- Landscape 3:2, at least **3000 × 2000 px**, JPEG.
- Keep the people and the main action inside the **central 60%** of the frame. The site crops each image to a 16:10 card, a 2:1 banner and a small square thumbnail.

---

## Prompts (copy each one as-is)

### 1. Planning Workday

```
Create a photorealistic, editorial-quality photograph for a premium enterprise consulting website. FORMAT: landscape 3:2, 3000 x 2000 pixels, sharp, natural. Keep the people and main action inside the central 60% of the frame so the image can also be cropped to a wide 2:1 banner and to a square.

SCENE: a planning workshop in a bright, modern meeting room. Three professionals (a South Asian woman in her thirties, a European man in his forties, a Southeast Asian woman in her late twenties) stand and sit around a light oak table in front of a large glass wall covered with neatly arranged pale sticky notes and a hand-drawn process flow in grey marker. One woman places a sticky note on the glass; the others watch and discuss. An open laptop and a notebook on the table. Focused, collaborative, optimistic mood.

STYLE (identical across the whole series): bright natural daylight from large floor-to-ceiling windows on the left; minimalist office with white walls, light oak wood, pale grey surfaces and one muted green plant; neutral, soft-contrast colour grade with gently warm highlights; shot on a full-frame camera, 35mm lens at f/2.8, shallow depth of field; candid documentary feel, not posed. Clothing in neutral tones only: white, light grey, navy, beige, camel.

RULES: nobody looks at the camera; no readable text anywhere (sticky notes and screens blurred or abstract); no logos, brand names or watermarks; no red, orange, purple or bright green; natural hands and faces; not a render, not illustration.
```

### 2. Recently Gone Live

```
Create a photorealistic, editorial-quality photograph for a premium enterprise consulting website. FORMAT: landscape 3:2, 3000 x 2000 pixels, sharp, natural. Keep the people and main action inside the central 60% of the frame so the image can also be cropped to a wide 2:1 banner and to a square.

SCENE: a calm support moment just after a new software system has gone live. A consultant (a South Asian man in his thirties, navy knit sweater) sits beside a client team member (a European woman in her forties, light grey blazer) at a clean desk. Both look at a large monitor showing a clean, abstract dashboard with soft blue charts and no readable text. He gestures gently at the screen, explaining; she nods, relaxed and reassured. A coffee cup and a closed notebook on the desk. Mood: steady, confident, supported.

STYLE (identical across the whole series): bright natural daylight from large floor-to-ceiling windows on the left; minimalist office with white walls, light oak wood, pale grey surfaces and one muted green plant; neutral, soft-contrast colour grade with gently warm highlights; shot on a full-frame camera, 35mm lens at f/2.8, shallow depth of field; candid documentary feel, not posed. Clothing in neutral tones only: white, light grey, navy, beige, camel.

RULES: nobody looks at the camera; no readable text anywhere (screens abstract); no logos, brand names or watermarks; no red, orange, purple or bright green; natural hands and faces; not a render, not illustration.
```

### 3. Maximizing an Existing Workday Environment

```
Create a photorealistic, editorial-quality photograph for a premium enterprise consulting website. FORMAT: landscape 3:2, 3000 x 2000 pixels, sharp, natural. Keep the people and main action inside the central 60% of the frame so the image can also be cropped to a wide 2:1 banner and to a square.

SCENE: an improvement review in a bright open-plan office. Two professionals (a Southeast Asian man in his forties in a white shirt, and a Black woman in her thirties in a camel jumper) stand at a tall table, reviewing a tablet together; behind them, slightly out of focus, a wall-mounted screen shows clean upward-trending charts in soft blue with no readable text. She points at something on the tablet; he leans in, thoughtful. Mood: analytical, constructive, forward-looking.

STYLE (identical across the whole series): bright natural daylight from large floor-to-ceiling windows on the left; minimalist office with white walls, light oak wood, pale grey surfaces and one muted green plant; neutral, soft-contrast colour grade with gently warm highlights; shot on a full-frame camera, 35mm lens at f/2.8, shallow depth of field; candid documentary feel, not posed. Clothing in neutral tones only: white, light grey, navy, beige, camel.

RULES: nobody looks at the camera; no readable text anywhere (screens and tablet abstract); no logos, brand names or watermarks; no red, orange, purple or bright green; natural hands and faces; not a render, not illustration.
```

### 4. Connecting Your Enterprise

```
Create a photorealistic, editorial-quality photograph for a premium enterprise consulting website. FORMAT: landscape 3:2, 3000 x 2000 pixels, sharp, natural. Keep the people and main action inside the central 60% of the frame so the image can also be cropped to a wide 2:1 banner and to a square.

SCENE: a technical consultant (a South Asian woman in her early thirties, hair tied back, navy shirt) works at a standing desk with two large monitors, seen from slightly behind and to the side (over-the-shoulder, three-quarter view). The monitors show a clean, abstract integration diagram: rounded boxes connected by flowing lines and small nodes, in soft blue and grey on white, with no readable text. One hand rests on the keyboard, the other points toward a connection on the screen. A colleague is softly blurred in the background. Mood: precise, calm, in control.

STYLE (identical across the whole series): bright natural daylight from large floor-to-ceiling windows on the left; minimalist office with white walls, light oak wood, pale grey surfaces and one muted green plant; neutral, soft-contrast colour grade with gently warm highlights; shot on a full-frame camera, 35mm lens at f/2.8, shallow depth of field; candid documentary feel, not posed. Clothing in neutral tones only: white, light grey, navy, beige, camel.

RULES: nobody looks at the camera; no readable text anywhere (screens abstract); no logos, brand names or watermarks; no red, orange, purple or bright green; natural hands and faces; not a render, not illustration.
```

---

## Check each image before using it

Regenerate any image that fails one of these:

- [ ] Nobody looks at the camera
- [ ] No readable text, logos or watermarks (screens and sticky notes are abstract or blurred)
- [ ] Hands and faces look natural
- [ ] No red, orange, purple or bright green
- [ ] Faces and the main action sit within the central 60% of the frame
- [ ] All four look like one shoot: same office, light and colour grade

---

## Putting them on the site

1. Save the four files to `web/public/journey/` with the names above.
2. In `web/src/lib/what-we-do-content.ts`, find `WHAT_WE_DO.journey.options`. In each option's `photo` object:
   - set `src` to the new file, e.g. `"/journey/01-planning.jpg"`
   - set `width` and `height` to the file's real pixel size
   - set `alt` to the matching line below
   - set `position` (CSS `object-position`, e.g. `"50% 40%"`) only if a face gets cropped in the card or banner; otherwise delete it
   - delete the `/** [COMP] */` comment above that `photo`, because these are now the real images

   | Option | `alt` |
   |---|---|
   | 01 | A team mapping a process flow on a glass wall during a planning workshop |
   | 02 | A consultant talking a client through a live dashboard at her desk |
   | 03 | Two colleagues reviewing improvement figures on a tablet in a bright office |
   | 04 | A consultant working through an integration diagram across two monitors |

3. From `web/`, run `npx tsc --noEmit -p .` and `npx eslint src/lib/what-we-do-content.ts`. Both must pass with no errors.
4. Don't change anything else. The section's layout and animation are finished.
