import { LegalPage } from "@/components/page/legal-page";
import { TERMS } from "@/lib/legal-content";

export const metadata = {
  title: "Terms & Conditions",
  description: "The terms on which hazebergconsulting.com is made available.",
};

export default function Page() {
  return <LegalPage doc={TERMS} other={{ label: "Privacy Policy", href: "/privacy" }} />;
}
