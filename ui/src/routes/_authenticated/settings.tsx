import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/lib/use-session";
import { supabase } from "@/integrations/supabase/client";
import { Panel, PanelHeader, PanelTitle } from "@/components/surfaces/Panel";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{ title: "Settings — Autonomous AI Systems" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:px-10">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        account · settings
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Settings</h1>

      <Panel className="mt-8">
        <PanelHeader>
          <PanelTitle>Identity</PanelTitle>
        </PanelHeader>
        <div className="flex items-center gap-4 p-5">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="h-12 w-12 rounded-full border border-border-strong object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-surface-3" />
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium">
              {user?.user_metadata?.full_name ?? "Operator"}
            </div>
            <div className="font-mono text-[12px] text-muted-foreground truncate">
              {user?.email}
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader>
          <PanelTitle>Session</PanelTitle>
        </PanelHeader>
        <div className="flex items-center justify-between p-5">
          <div className="text-[13px] text-muted-foreground">
            Sign out of this workspace.
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </div>
      </Panel>

      <Panel className="mt-4">
        <PanelHeader>
          <PanelTitle>Runtime</PanelTitle>
        </PanelHeader>
        <div className="grid grid-cols-2 gap-px overflow-hidden bg-border-subtle text-[12px] md:grid-cols-3">
          <KV k="Build" v="0.4.1 · dev" />
          <KV k="Env" v="local" />
          <KV k="Region" v="auto" />
          <KV k="Model gateway" v="lovable-ai" />
          <KV k="Telemetry" v="enabled" />
          <KV k="Theme" v="dark" />
        </div>
      </Panel>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface-1 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{k}</div>
      <div className="mt-1 font-mono text-[12px] text-foreground">{v}</div>
    </div>
  );
}
