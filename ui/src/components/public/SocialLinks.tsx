import { Github, Linkedin, BookOpen, Globe } from "lucide-react";
import { creator } from "@/lib/projects";

const items = [
  { href: creator.socials.github, label: "GitHub", Icon: Github },
  { href: creator.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: creator.socials.medium, label: "Writing", Icon: BookOpen },
  { href: creator.socials.portfolio, label: "Portfolio", Icon: Globe },
];

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border-subtle bg-surface-1 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition hover:border-border-strong hover:bg-surface-2 hover:text-foreground"
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </a>
      ))}
    </div>
  );
}
