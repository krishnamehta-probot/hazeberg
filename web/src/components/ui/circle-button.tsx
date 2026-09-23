import type { LucideIcon } from "lucide-react";

/**
 * A round icon button. The only one on the site, and it exists for exactly one
 * job: back-to-top. Anything that carries a word is a `CtaPill` instead.
 *
 * The label is always in the DOM for assistive tech; the icon is what is seen.
 */
export function CircleButton({
  label,
  icon: Icon,
  onClick,
  className = "",
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-spec
      className={`spec grid size-11 cursor-pointer place-items-center rounded-pill bg-ink text-ink-invert ${className}`}
    >
      <Icon aria-hidden className="size-4" strokeWidth={2} />
    </button>
  );
}
