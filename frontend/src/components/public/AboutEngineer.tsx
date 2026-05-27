import { creator } from "@/lib/projects";
import { SocialLinks } from "./SocialLinks";

export function AboutEngineer() {
  return (
    <section className="rounded-2xl border border-border-subtle bg-surface-1/60 p-8 md:p-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        about the engineer
      </div>
      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">{creator.name}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {creator.role}
          </p>
          <div className="mt-5">
            <SocialLinks />
          </div>
        </div>
        <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground">
          <p>{creator.bio}</p>
          <p className="border-l-2 border-accent/40 pl-4 text-foreground/90">
            {creator.philosophy}
          </p>
        </div>
      </div>
    </section>
  );
}
