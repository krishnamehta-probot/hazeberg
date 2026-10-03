/**
 * The Berg app's two store QR codes, as vector path data.
 *
 * The owner's change list of 2026-10-03 asked for QR codes for the Android and
 * iOS apps on the Berg page, and attached two PNGs (`public/Hazeberg/BERG -
 * Android QR Code.png`, 205x199, and `BERG - iOS QR Code.png`, 163x165). Both
 * decode cleanly with jsQR, to exactly the two URLs below, but they are too
 * small and too soft to ship: a 205px raster drawn at 160px on a 2x screen is
 * a blur with corners. So the codes are REDRAWN from the URLs they encode,
 * not traced from the pictures. A QR code is a pure function of its text and
 * its settings, so a redraw is the same code at any size, not an approximation
 * of it.
 *
 * Generated, and checked, by `scripts/qr-codes.mjs`. Neither `qrcode` nor
 * `jsqr` is a dependency of this app and neither should become one for two
 * strings that change once a year, so the run line installs them for the run
 * only. From web/:
 *
 *   npm i --no-save qrcode jsqr && node scripts/qr-codes.mjs --check
 *
 * What it does, which is the whole of it (its header has the detail):
 *
 *   1. `QRCode.create(url, { errorCorrectionLevel: "M", version: 5 })` gives
 *      the module matrix. **Level M**, which survives about 15% damage: Q and
 *      H buy robustness against stickers and scuffs that a code on a screen
 *      never suffers, and pay for it in density. **One version for both**, the
 *      smallest that holds the longer URL: the two codes sit on identical
 *      tiles, so their modules must match too. Version 5 is 37 modules; the
 *      Play Store URL is 83 bytes of the 84 that 5-M holds, so one more
 *      character moves both to version 6. The owner's PNGs are versions 7 and
 *      5.
 *   2. Every horizontal run of dark modules becomes one closed rectangle,
 *      `m<dx> <dy>h<n>v1h-<n>z`, each relative to the previous run's start,
 *      so a whole code is ONE path of a few thousand characters.
 *   3. A 4-module quiet zone is added on every side, which is what the spec
 *      asks for, so `size` is the matrix plus 8 and the viewBox is
 *      `0 0 size size` in module units.
 *
 * `--check` renders each path below at 400px with sharp, dark on white, and
 * decodes it with jsQR: both decode to their `url` exactly. It also fails if
 * this block is not exactly what `--write` would write.
 *
 * **If a URL changes, regenerate.** The path IS the URL; editing `url` alone
 * leaves a code that still scans to the old address, and nothing on the page
 * would show it. Change the URL in the script's `URLS` and run it with
 * `--write`, which rewrites only the block between the markers and then runs
 * the check.
 *
 * On the page, the URLs live HERE and nowhere else: the store links read
 * `QR_CODES[key].url`, so a code and the link beside it can never point at two
 * different places. (The script holds its own copy as input; `--check` fails
 * when the two disagree.) The labels are copy and live with the rest of the
 * page's copy in `BERG.app` (`lib/berg-content.ts`).
 */

export type QrCode = {
  /** What the code encodes, and where the link beside it goes. */
  url: string;
  /** Width and height of the viewBox, in modules, quiet zone included. */
  size: number;
  /** Every dark module, as one path in module units. */
  path: string;
};

export const QR_CODES = {
  // @@generated:start
  android: {
    url: "https://play.google.com/store/apps/details?id=com.shrewd.berg&pcampaignid=web_share",
    size: 45,
    path: "M4 4h7v1h-7zm9 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm3 0h4v1h-4zm5 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h7v1h-7zm-30 1h1v1h-1zm6 0h1v1h-1zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm4 0h4v1h-4zm6 0h1v1h-1zm6 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm3 0h1v1h-1zm5 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h5v1h-5zm6 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm5 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h3v1h-3zm4 0h3v1h-3zm6 0h6v1h-6zm10 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm6 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm4 0h3v1h-3zm5 0h1v1h-1zm5 0h3v1h-3zm4 0h1v1h-1zm6 0h1v1h-1zm-36 1h7v1h-7zm8 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h7v1h-7zm-22 1h2v1h-2zm4 0h4v1h-4zm6 0h1v1h-1zm3 0h3v1h-3zm5 0h1v1h-1zm2 0h1v1h-1zm-28 1h1v1h-1zm2 0h5v1h-5zm7 0h3v1h-3zm6 0h1v1h-1zm7 0h2v1h-2zm3 0h2v1h-2zm5 0h5v1h-5zm-26 1h2v1h-2zm3 0h4v1h-4zm6 0h1v1h-1zm2 0h3v1h-3zm4 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm-35 1h1v1h-1zm2 0h2v1h-2zm4 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h3v1h-3zm5 0h3v1h-3zm5 0h4v1h-4zm5 0h2v1h-2zm-35 1h1v1h-1zm2 0h4v1h-4zm8 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm7 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm-36 1h1v1h-1zm6 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm2 0h5v1h-5zm7 0h4v1h-4zm5 0h3v1h-3zm-33 1h1v1h-1zm4 0h1v1h-1zm5 0h2v1h-2zm3 0h2v1h-2zm3 0h5v1h-5zm7 0h2v1h-2zm5 0h1v1h-1zm3 0h1v1h-1zm-31 1h1v1h-1zm2 0h3v1h-3zm4 0h3v1h-3zm4 0h3v1h-3zm4 0h2v1h-2zm3 0h1v1h-1zm4 0h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h3v1h-3zm4 0h2v1h-2zm-35 1h6v1h-6zm7 0h3v1h-3zm4 0h1v1h-1zm4 0h2v1h-2zm6 0h2v1h-2zm7 0h1v1h-1zm2 0h3v1h-3zm5 0h2v1h-2zm-31 1h3v1h-3zm4 0h3v1h-3zm9 0h1v1h-1zm3 0h1v1h-1zm2 0h6v1h-6zm7 0h4v1h-4zm5 0h1v1h-1zm-34 1h1v1h-1zm2 0h3v1h-3zm7 0h2v1h-2zm5 0h2v1h-2zm5 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm-33 1h2v1h-2zm5 0h1v1h-1zm3 0h3v1h-3zm6 0h2v1h-2zm5 0h1v1h-1zm2 0h1v1h-1zm4 0h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm3 0h2v1h-2zm-32 1h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm5 0h4v1h-4zm5 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm3 0h2v1h-2zm3 0h3v1h-3zm6 0h1v1h-1zm-36 1h1v1h-1zm2 0h7v1h-7zm9 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h4v1h-4zm5 0h2v1h-2zm3 0h3v1h-3zm-31 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm2 0h6v1h-6zm10 0h1v1h-1zm5 0h1v1h-1zm-32 1h6v1h-6zm8 0h1v1h-1zm4 0h6v1h-6zm7 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm5 0h4v1h-4zm5 0h2v1h-2zm-34 1h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm5 0h4v1h-4zm9 0h3v1h-3zm5 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm4 0h1v1h-1zm-33 1h5v1h-5zm7 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h4v1h-4zm7 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm-34 1h5v1h-5zm8 0h1v1h-1zm4 0h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm5 0h1v1h-1zm-33 1h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm5 0h1v1h-1zm11 0h3v1h-3zm4 0h2v1h-2zm4 0h3v1h-3zm-34 1h1v1h-1zm4 0h1v1h-1zm4 0h2v1h-2zm3 0h1v1h-1zm9 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h5v1h-5zm7 0h1v1h-1zm-35 1h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm7 0h3v1h-3zm4 0h1v1h-1zm5 0h1v1h-1zm2 0h2v1h-2zm3 0h8v1h-8zm9 0h1v1h-1zm-28 1h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h2v1h-2zm3 0h2v1h-2zm4 0h1v1h-1zm4 0h2v1h-2zm5 0h2v1h-2zm3 0h1v1h-1zm-35 1h7v1h-7zm9 0h1v1h-1zm2 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm-36 1h1v1h-1zm6 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h4v1h-4zm5 0h2v1h-2zm4 0h2v1h-2zm5 0h2v1h-2zm3 0h1v1h-1zm-35 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm2 0h9v1h-9zm10 0h1v1h-1zm2 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm4 0h1v1h-1zm2 0h4v1h-4zm5 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm3 0h1v1h-1zm2 0h3v1h-3zm-34 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm5 0h3v1h-3zm4 0h6v1h-6zm10 0h3v1h-3zm-34 1h1v1h-1zm6 0h1v1h-1zm3 0h3v1h-3zm6 0h1v1h-1zm3 0h1v1h-1zm3 0h2v1h-2zm3 0h1v1h-1zm4 0h3v1h-3zm4 0h1v1h-1zm4 0h1v1h-1zm-36 1h7v1h-7zm8 0h2v1h-2zm6 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm5 0h3v1h-3zm5 0h2v1h-2zm3 0h5v1h-5z",
  },
  ios: {
    url: "https://apps.apple.com/in/app/berg-hazeberg/id6756188557",
    size: 45,
    path: "M4 4h7v1h-7zm16 0h1v1h-1zm10 0h2v1h-2zm4 0h7v1h-7zm-30 1h1v1h-1zm6 0h1v1h-1zm3 0h2v1h-2zm3 0h3v1h-3zm4 0h2v1h-2zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h2v1h-2zm3 0h1v1h-1zm6 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h6v1h-6zm7 0h2v1h-2zm6 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm3 0h2v1h-2zm6 0h6v1h-6zm7 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h7v1h-7zm8 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h1v1h-1zm6 0h1v1h-1zm2 0h1v1h-1zm3 0h4v1h-4zm6 0h1v1h-1zm4 0h1v1h-1zm4 0h3v1h-3zm5 0h1v1h-1zm6 0h1v1h-1zm-36 1h7v1h-7zm8 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h7v1h-7zm-22 1h2v1h-2zm5 0h7v1h-7zm8 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm-27 1h1v1h-1zm2 0h5v1h-5zm7 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm4 0h5v1h-5zm-30 1h2v1h-2zm3 0h1v1h-1zm7 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm2 0h3v1h-3zm-33 1h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm7 0h4v1h-4zm6 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm4 0h2v1h-2zm5 0h2v1h-2zm-34 1h2v1h-2zm3 0h1v1h-1zm4 0h3v1h-3zm4 0h1v1h-1zm3 0h1v1h-1zm4 0h4v1h-4zm5 0h1v1h-1zm4 0h4v1h-4zm8 0h1v1h-1zm-30 1h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm3 0h3v1h-3zm4 0h2v1h-2zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h3v1h-3zm4 0h5v1h-5zm-32 1h6v1h-6zm7 0h1v1h-1zm5 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm5 0h1v1h-1zm5 0h2v1h-2zm3 0h1v1h-1zm-31 1h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm2 0h5v1h-5zm6 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm5 0h7v1h-7zm8 0h2v1h-2zm-35 1h2v1h-2zm4 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h6v1h-6zm9 0h1v1h-1zm3 0h1v1h-1zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-33 1h5v1h-5zm8 0h1v1h-1zm3 0h3v1h-3zm5 0h1v1h-1zm2 0h5v1h-5zm7 0h2v1h-2zm3 0h3v1h-3zm4 0h2v1h-2zm-34 1h1v1h-1zm3 0h1v1h-1zm4 0h6v1h-6zm8 0h3v1h-3zm6 0h1v1h-1zm5 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-35 1h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h2v1h-2zm3 0h2v1h-2zm5 0h1v1h-1zm2 0h2v1h-2zm3 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm3 0h2v1h-2zm-33 1h1v1h-1zm2 0h1v1h-1zm3 0h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm5 0h2v1h-2zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm-36 1h5v1h-5zm6 0h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm5 0h4v1h-4zm5 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm-32 1h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h10v1h-10zm12 0h2v1h-2zm5 0h1v1h-1zm-33 1h2v1h-2zm4 0h5v1h-5zm7 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm4 0h3v1h-3zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h1v1h-1zm-33 1h1v1h-1zm5 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm3 0h3v1h-3zm4 0h2v1h-2zm4 0h1v1h-1zm3 0h1v1h-1zm3 0h2v1h-2zm4 0h1v1h-1zm-35 1h3v1h-3zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h3v1h-3zm4 0h2v1h-2zm6 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm-34 1h4v1h-4zm5 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm-32 1h1v1h-1zm6 0h2v1h-2zm3 0h1v1h-1zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm4 0h2v1h-2zm5 0h4v1h-4zm5 0h2v1h-2zm-35 1h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm4 0h2v1h-2zm3 0h4v1h-4zm7 0h3v1h-3zm5 0h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm-33 1h1v1h-1zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h8v1h-8zm-20 1h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm3 0h2v1h-2zm3 0h2v1h-2zm5 0h2v1h-2zm5 0h2v1h-2zm-32 1h7v1h-7zm9 0h1v1h-1zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm6 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm-34 1h1v1h-1zm6 0h1v1h-1zm2 0h2v1h-2zm3 0h6v1h-6zm8 0h2v1h-2zm4 0h1v1h-1zm3 0h3v1h-3zm6 0h2v1h-2zm-32 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h7v1h-7zm9 0h6v1h-6zm7 0h1v1h-1zm2 0h1v1h-1zm-36 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm2 0h3v1h-3zm4 0h4v1h-4zm7 0h1v1h-1zm5 0h1v1h-1zm2 0h3v1h-3zm4 0h3v1h-3zm-32 1h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h2v1h-2zm5 0h2v1h-2zm3 0h2v1h-2zm3 0h3v1h-3zm4 0h1v1h-1zm2 0h1v1h-1zm4 0h2v1h-2zm3 0h1v1h-1zm-36 1h1v1h-1zm6 0h1v1h-1zm5 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm4 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm-36 1h7v1h-7zm8 0h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1zm5 0h1v1h-1zm6 0h5v1h-5zm6 0h2v1h-2zm3 0h5v1h-5z",
  },
  // @@generated:end
} as const satisfies Record<string, QrCode>;

export type QrKey = keyof typeof QR_CODES;
