import {
  Blocks,
  ChartColumn,
  Headset,
  Landmark,
  Users,
  Wallet,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { ServiceIconKey } from "@/lib/service-content";

/**
 * One glyph per module, the same ones the header's Services panel wears
 * (`site-header.tsx` `NAV_ICONS`), so the icon a reader clicked in the menu is
 * the icon that opens the page. Presentation, not content: the client supplied
 * no module icons.
 */
export const SERVICE_ICON: Record<ServiceIconKey, LucideIcon> = {
  hcm: Users,
  payroll: Wallet,
  financials: Landmark,
  integrations: Workflow,
  reporting: ChartColumn,
  extend: Blocks,
  /* The AMS capability's glyph on What we do (`capability-chip.tsx`), so the
     page and the capability it grew out of wear the same one. */
  ams: Headset,
};

const BY_HREF: Record<string, LucideIcon> = {
  "/services/workday-hcm": Users,
  "/services/workday-payroll": Wallet,
  "/services/workday-financials": Landmark,
  "/services/workday-integrations": Workflow,
  "/services/workday-reporting-analytics": ChartColumn,
  "/services/workday-extend": Blocks,
  "/services/workday-ams": Headset,
  /* The AMS capability on What we do, which the "Support" routes still open. */
  "/what-we-do#workday-ams": Headset,
};

/** The icon for a related-service link, by where it goes. */
export function iconForHref(href: string): LucideIcon | undefined {
  return BY_HREF[href];
}
