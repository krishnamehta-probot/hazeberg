import { notFound } from "next/navigation";

import { SERVICES } from "@/lib/home-content";

const ROUTED = SERVICES.items.filter((s) => s.href.startsWith("/services/"));

const find = (slug: string) => ROUTED.find((s) => s.href === `/services/${slug}`);

export function generateStaticParams() {
  return ROUTED.map((s) => ({ slug: s.href.replace("/services/", "") }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  return { title: find(slug)?.label ?? "Service" };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = find(slug);
  if (!service) notFound();

  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-[var(--section-y)] pt-[calc(var(--header-h)+6rem)]">
      <p className="text-xs font-medium tracking-caps text-ink-subtle uppercase">Services</p>
      <h1 className="mt-6 max-w-[16ch] text-4xl font-normal text-balance text-ink">
        {service.label}
      </h1>
      <p className="mt-6 max-w-[48ch] text-sm text-ink-muted">{service.body}</p>
    </section>
  );
}
