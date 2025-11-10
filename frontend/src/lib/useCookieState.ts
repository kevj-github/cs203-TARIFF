import { useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (raw: string) => T;

interface CookieStateOptions<T> {
  serialize?: Serializer<T>;
  deserialize?: Deserializer<T>;
  // Cookie lifetime in days; omit for session cookie
  days?: number;
}

export function useCookieState<T>(
  key: string,
  initial: T,
  options?: CookieStateOptions<T>
) {
  const serialize: Serializer<T> =
    options?.serialize ?? ((v) => JSON.stringify(v));
  const deserialize: Deserializer<T> =
    options?.deserialize ?? ((s) => JSON.parse(s));

  const [state, setState] = useState<T>(() => {
    try {
      const raw = typeof document !== "undefined" ? getCookie(key) : null;
      if (raw != null) {
        return deserialize(raw);
      }
    } catch {
      // ignore parse errors, fall back to initial
    }
    return initial;
  });

  useEffect(() => {
    try {
      setCookie(key, serialize(state), options?.days);
    } catch {
      // ignore write errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, state]);

  return [state, setState] as const;
}