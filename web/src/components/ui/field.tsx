import { ChevronDown } from "lucide-react";

/**
 * The site's form controls. One definition of the box, three things that can sit
 * in it — the register has carried "Form field (input, select, textarea, error)"
 * as *prototyped* since phase 1, and the contact form is what makes it real.
 *
 * The box: white on the surface, a hairline ring, 12px radius — the same three
 * decisions every card on the site makes, so a form reads as part of the page
 * rather than as a widget dropped into it. It fills its column at every width;
 * a 320px screen gets the same control as a 1920px one, only narrower.
 *
 * Height is 3rem minimum before padding, which puts every control over the 44px
 * hit-area floor with room, and the label is a real `<label for>` so tapping the
 * label focuses the control — on a phone the label is a bigger target than the
 * box.
 *
 * **Focus is not restyled.** `:focus-visible` in `globals.css` draws a 2px blue
 * outline offset by 3px on everything on the site; a control that paints its own
 * focus state ends up with two. What focus adds here is the ring going solid
 * blue, which is the box agreeing it is active — not a replacement for the ring.
 *
 * The error state is `--danger`, the one non-brand colour in the system, and it
 * is never carried by colour alone: the message is text, it is wired to the
 * control with `aria-describedby`, and the control carries `aria-invalid`.
 */

/* Shared by all three. `field-sizing` is not used — it is not in every browser
   yet, and the textarea's rows are a design decision anyway. */
const BOX =
  "w-full min-h-12 rounded-md bg-canvas px-4 py-3 text-sm text-ink transition dur-fast ease-brand ring-1 placeholder:text-ink-subtle";

function box(invalid: boolean) {
  return `${BOX} ${
    invalid
      ? "ring-danger-soft hover:ring-danger focus:ring-danger"
      : "ring-border hover:ring-border-strong focus:ring-primary"
  }`;
}

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-ink">
      {children}
      {/* "Optional" on the ones that are, rather than an asterisk on the ones
          that are not. Six fields with five asterisks is noise; one word on the
          single optional field is information. */}
      {optional ? (
        <span className="font-mono text-[0.625rem] tracking-caps text-ink-subtle uppercase">
          optional
        </span>
      ) : null}
    </label>
  );
}

function Error({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    /* `role="alert"` so it is announced when it appears — the field is already
       described by it, but a message that arrives after a failed submit has to
       reach a screen reader without the user moving focus back to the control. */
    <p id={id} role="alert" className="text-xs text-danger">
      {message}
    </p>
  );
}

type Common = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  /** Spans both columns of the form's grid. */
  wide?: boolean;
};

function Wrap({
  id,
  label,
  error,
  optional,
  wide,
  children,
}: Common & { children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      {children}
      <Error id={`${id}-error`} message={error} />
    </div>
  );
}

/** Ties the control to its message, and only when there is one. */
function described(id: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}

export function TextField({
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  ...common
}: Common & {
  type?: "text" | "email" | "tel";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <Wrap {...common}>
      <input
        id={common.id}
        name={common.id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={box(Boolean(common.error))}
        {...described(common.id, common.error)}
      />
    </Wrap>
  );
}

export function TextareaField({
  value,
  onChange,
  placeholder,
  rows = 5,
  ...common
}: Common & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <Wrap {...common}>
      <textarea
        id={common.id}
        name={common.id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${box(Boolean(common.error))} resize-y`}
        {...described(common.id, common.error)}
      />
    </Wrap>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Choose one",
  ...common
}: Common & {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <Wrap {...common}>
      {/* A native `<select>`, deliberately. A custom listbox would have to
          re-implement type-ahead, keyboard paging and the mobile wheel, and a
          phone's own picker beats anything drawn in the page. All that is styled
          is the box and the chevron: `appearance-none` kills the platform arrow
          so the one below can sit where the design wants it, and the chevron is
          `pointer-events-none` so clicking it still opens the menu. */}
      <div className="relative">
        <select
          id={common.id}
          name={common.id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${box(Boolean(common.error))} cursor-pointer appearance-none pr-11 ${
            value ? "" : "text-ink-subtle"
          }`}
          {...described(common.id, common.error)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-subtle"
          strokeWidth={1.8}
        />
      </div>
    </Wrap>
  );
}
