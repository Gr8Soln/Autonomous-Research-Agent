import { createContext, useContext, useEffect, useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "./Topbar";
import { CommandPaletteProvider } from "./CommandPalette";

type SidebarCtx = {
  isMobile: boolean;
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const Ctx = createContext<SidebarCtx | null>(null);

export function useAppSidebar() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppSidebar outside provider");
  return c;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const toggle = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <Ctx.Provider value={{ isMobile, collapsed, toggle, mobileOpen, setMobileOpen }}>
      <CommandPaletteProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          {/* Desktop sidebar */}
          {!isMobile && <SidebarNav />}

          {/* Mobile drawer */}
          {isMobile && mobileOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 animate-in slide-in-from-left duration-200">
                <SidebarNav />
              </div>
            </>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-auto scrollbar-thin">{children}</main>
          </div>
        </div>
      </CommandPaletteProvider>
    </Ctx.Provider>
  );
}
