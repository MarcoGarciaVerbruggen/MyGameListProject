import { useEffect, useState } from "react";

// In-memory cache so navigating back to a game you already viewed
// doesn't re-fetch it.
const cache = new Map();

// Steam's appdetails endpoint has no CORS headers, so a direct browser
// fetch fails. This public proxy is fine for a mockup — swap it for a
// real backend proxy (e.g. an endpoint in your Java app) before this
// goes anywhere near production.
const PROXY = "https://corsproxy.io/?url=";

export function useSteamDetails(appId) {
  const [data, setData] = useState(cache.get(appId) ?? null);
  const [loading, setLoading] = useState(!!appId && appId !== 0 && !cache.has(appId));

  useEffect(() => {
    if (!appId || appId === 0) return;

    if (cache.has(appId)) {
      setData(cache.get(appId));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;

    fetch(PROXY + encodeURIComponent(url))
      .then((res) => res.json())
      .then((json) => {
        const entry = json[appId];
        const details = entry?.success ? entry.data : null;
        cache.set(appId, details);
        if (!cancelled) setData(details);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appId]);

  return { data, loading };
}
