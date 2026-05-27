import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { projects } from "@/lib/projects";
import { supabase } from "@/integrations/supabase/client";
import { LayoutGrid, Settings, LogOut, Boxes } from "lucide-react";

type Ctx = { open: boolean; setOpen: (o: boolean) => void };
const PaletteCtx = createContext<Ctx>({ open: false, setOpen: () => {} });
export const useCommandPalette = () => useContext(PaletteCtx);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 50);
  };

  return (
    <PaletteCtx.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to system, action…" />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => run(() => navigate({ to: "/lab" }))}>
              <LayoutGrid className="mr-2 h-3.5 w-3.5" /> Lab
            </CommandItem>
            <CommandItem onSelect={() => run(() => navigate({ to: "/settings" }))}>
              <Settings className="mr-2 h-3.5 w-3.5" /> Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Systems">
            {projects.map((p) => (
              <CommandItem
                key={p.slug}
                onSelect={() => run(() => navigate({ to: "/lab/$slug", params: { slug: p.slug } }))}
              >
                <Boxes className="mr-2 h-3.5 w-3.5" />
                <span>{p.name}</span>
                <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">
                  {p.status}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => run(() => supabase.auth.signOut())}>
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </PaletteCtx.Provider>
  );
}
