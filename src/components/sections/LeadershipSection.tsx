"use client";

import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { president, vicePresident } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Leadership section (components/sections). Renders the President and
 * Vice President via the reusable LeaderCard component.
 */
export function LeadershipSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("union.leadershipHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("union.leadershipSubheading")}
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <LeaderCard leader={president} />
          <LeaderCard leader={vicePresident} />
        </div>
      </Container>
    </section>
  );
}
