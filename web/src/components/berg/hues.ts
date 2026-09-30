/**
 * The three groups' own colours — the badge shade of each: teal, violet and a
 * deep amber, the ones the network scene's pills and dots use. Shared so the
 * home page's Berg band can mark the same three groups in the same three
 * colours without keeping a second copy.
 *
 * A plain module, not the scene's: everything exported from a "use client" file
 * reaches a server component as a client reference, not as a value.
 */
export const BERG_HUES = {
  customers: "#0E8F8A",
  firms: "#5B41CF",
  consultants: "#8A6700",
} as const;
