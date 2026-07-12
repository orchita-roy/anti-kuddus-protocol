"use client";
import { openDB } from "idb";
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";

export type OfflineSosItem = { idempotencyKey: string; location: string; createdAt: string };
const database = () => openDB("anti-kuddus-offline", 1, { upgrade(db) { if (!db.objectStoreNames.contains("sos")) db.createObjectStore("sos", { keyPath: "idempotencyKey" }); } });

export function useOfflineSos(onSynced: (alert: any) => void) {
  const [queuedCount, setQueuedCount] = useState(0);
  const refresh = useCallback(async () => setQueuedCount(await (await database()).count("sos")), []);
  const enqueue = useCallback(async (item: OfflineSosItem) => { await (await database()).put("sos", item); await refresh(); }, [refresh]);
  const flush = useCallback(async () => {
    if (!navigator.onLine) return;
    const db = await database(); const items = await db.getAll("sos") as OfflineSosItem[];
    for (const item of items) { try { const alert = await apiRequest("/api/sos", { method: "POST", body: JSON.stringify(item) }); await db.delete("sos", item.idempotencyKey); onSynced(alert); } catch { /* Preserve failed items for the next online event. */ } }
    await refresh();
  }, [onSynced, refresh]);
  useEffect(() => { void refresh(); void flush(); const online = () => void flush(); window.addEventListener("online", online); return () => window.removeEventListener("online", online); }, [flush, refresh]);
  return { enqueue, flush, queuedCount };
}
