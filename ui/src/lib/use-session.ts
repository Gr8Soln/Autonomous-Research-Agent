import { useEffect, useState } from "react";

export type SessionState = {
  session: {} | null;
  loading: boolean;
};

export function useSession(): SessionState {
  const [state] = useState<SessionState>({
    session: null,
    loading: true,
  });

  useEffect(() => {
    return () => {};
  }, []);

  return state;
}
