import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useSession } from "@/lib/use-session";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
