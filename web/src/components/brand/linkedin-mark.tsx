/**
 * LinkedIn's mark, drawn here because Lucide dropped its brand glyphs and a
 * generic "link" icon next to a LinkedIn URL tells you nothing.
 *
 * Shared by the footer and the Contact page's direct lines — it was private to
 * the footer until the second one needed it (rule 3). `currentColor`, so it takes
 * the colour of whatever it sits in, on the dark ground and the light one.
 */
export function LinkedInMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05a4.17 4.17 0 0 1 3.75-2.06c4 0 4.74 2.63 4.74 6.06V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.84 0-2.12 1.43-2.12 2.9V21h-4V9Z" />
    </svg>
  );
}
