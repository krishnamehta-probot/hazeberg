import { LegalPage } from "@/components/page/legal-page";
import { PRIVACY } from "@/lib/legal-content";

export const metadata = {
  title: "Privacy Policy",
  description:
    "What hazebergconsulting.com collects, why, who sees it, and how to exercise your rights over it.",
};

export default function Page() {
  return <LegalPage doc={PRIVACY} other={{ label: "Terms & Conditions", href: "/terms" }} />;
}
