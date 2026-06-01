import { useEffect, useState } from "react";
import { getSession } from "./auth";
import type { Session } from "./types";

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    setSession(getSession());
  }, []);
  return session;
}