import {
  Activity,
  ArrowLeftRight,
  Award,
  Banknote,
  BookOpenCheck,
  Bot,
  Calculator,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  ChartLine,
  CircleDot,
  CodeXml,
  FileInput,
  FileUp,
  HandCoins,
  Layers,
  PenTool,
  Plug,
  RefreshCw,
  Scale,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sprout,
  TrendingUp,
  UserPlus,
  Wallet,
  Waypoints,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * One glyph per capability stage, keyed by the stage's `key`.
 *
 * Keyed by stage rather than by position, for the reason the services wheel
 * keys its icons by service: reordering the stages in the CMS must not be able
 * to hand "Paid" the recruiting glyph. That puts two keys on more than one
 * page, so their glyphs are chosen to be true of every page that uses them:
 *
 *   set-up   HCM's Core HR and Financials' core accounting. Layers: the
 *            foundation laid once that everything above it reads from —
 *            worker records in one, the chart of accounts in the other
 *   close    Payroll's tax and year-end, and Financials' close. A calendar
 *            with a tick: a period signed off, whichever books it was
 *   connect  Integrations' connectors, AMS's integration support and Extend's
 *            orchestrations. A plug: Workday joined to something else
 *   build    Integrations' custom work and Extend's app development. Code:
 *            both are built in Workday's own developer tools
 *   run      Integrations' monitoring and Extend's testing and support. A
 *            pulse: the thing is live and being watched
 *
 * HCM's "Paid" wears the wallet the Payroll page wears everywhere
 * (`SERVICE_ICON`), because that stage is payroll and its last item is the
 * door to that page.
 *
 * Presentation, not content: the client supplied no stage icons. A key this
 * map does not know gets the fallback rather than nothing, so a stage added in
 * the CMS renders before anybody has picked its glyph.
 */
export const STAGE_ICON: Readonly<Record<string, LucideIcon>> = {
  /* HCM */
  hired: UserPlus,
  "set-up": Layers,
  growing: Sprout,
  rewarded: Award,
  "on-the-clock": CalendarClock,
  paid: Wallet,
  /* Payroll */
  inputs: FileInput,
  calculate: Calculator,
  check: SearchCheck,
  pay: Banknote,
  post: BookOpenCheck,
  close: CalendarCheck,
  /* Financials — `set-up` and `close` are above */
  spend: ShoppingCart,
  earn: HandCoins,
  plan: ChartLine,
  control: ShieldCheck,
  /* Integrations */
  map: Waypoints,
  load: FileUp,
  connect: Plug,
  build: CodeXml,
  sync: ArrowLeftRight,
  run: Activity,
  /* AMS — `connect` is above */
  resolve: Wrench,
  change: SlidersHorizontal,
  release: RefreshCw,
  cycle: CalendarRange,
  improve: TrendingUp,
  /* Extend — `build`, `connect` and `run` are above */
  decide: Scale,
  design: PenTool,
  assist: Bot,
};

export const STAGE_ICON_FALLBACK: LucideIcon = CircleDot;

/** A stage's glyph. Always decorative: the stage's own name sits beside it. */
export function StageIcon({
  stageKey,
  className,
  strokeWidth = 1.8,
}: {
  stageKey: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = STAGE_ICON[stageKey] ?? STAGE_ICON_FALLBACK;
  return <Icon aria-hidden className={className} strokeWidth={strokeWidth} />;
}
