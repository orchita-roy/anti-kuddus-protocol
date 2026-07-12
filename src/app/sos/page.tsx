/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck -- realtime payload is validated by the server before publication.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useOfflineSos } from "@/hooks/use-offline-sos";
import { usePusherChannel } from "@/hooks/use-pusher-channel";
import { apiRequest } from "@/lib/api/client";

type Alert = { publicId: string; location: string; status: string };
const events = ["sos-acknowledged", "sos-resolved", "sos-cancelled"];

export default function Sos() {
  const [location, setLocation] = useState("classroom");
  const [alert, setAlert] = useState<Alert>();
  const [message, setMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const synced = useCallback((value: Alert) => {
    setAlert(value);
    setMessage("Queued alert synchronized");
  }, []);

  const { enqueue, queuedCount } = useOfflineSos(synced);
  const realtime = usePusherChannel(
    "captain-sos",
    events,
    useCallback((value: Alert) => {
      setAlert((current) => current?.publicId === value.publicId ? { ...current, status: value.status } : current);
    }, []),
  );

  useEffect(() => {
    if (!alert || realtime) return;
    const id = setInterval(() => {
      void apiRequest<Alert>(`/api/sos/${alert.publicId}`).then(setAlert).catch(() => undefined);
    }, 5_000);
    return () => clearInterval(id);
  }, [alert?.publicId, realtime]);

  function playEmergencySound() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      setMessage("SOS alert sent, but this browser tab is muted");
    });
  }

  async function send() {
    // This runs directly from the SOS click so browsers allow audible playback.
    playEmergencySound();
    const body = { idempotencyKey: crypto.randomUUID(), location, createdAt: new Date().toISOString() };

    if (!navigator.onLine) {
      await enqueue(body);
      setMessage("Queued — waiting for network");
      return;
    }

    try {
      setAlert(await apiRequest("/api/sos", { method: "POST", body: JSON.stringify(body) }));
      setMessage("Captains have been alerted");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send");
    }
  }

  async function cancel() {
    if (alert) setAlert(await apiRequest(`/api/sos/${alert.publicId}/cancel`, { method: "PATCH" }));
  }

  const hasOpenAlert = Boolean(alert && !["resolved", "cancelled"].includes(alert.status));

  return (
    <AppShell title="SOS rescue flare">
      <div style={{ textAlign: "center", maxWidth: 700, margin: "auto" }}>
        <div className="eyebrow">Mission 05 · Emergency response</div>
        <h1>Send location.<br />Never identity.</h1>
        <div className="actions" style={{ justifyContent: "center" }}>
          <span className={`badge ${realtime ? "green" : ""}`}>{realtime ? "Realtime connected" : "Polling fallback"}</span>
          <span className="badge">Offline queue: {queuedCount}</span>
        </div>
        <p>Choose where help is needed. Alerts store no student identifier.</p>
        <div className="field" style={{ maxWidth: 360, margin: "24px auto" }}>
          <label>Emergency location</label>
          <select value={location} onChange={(event) => setLocation(event.target.value)} disabled={hasOpenAlert}>
            {["library", "playground", "corridor", "classroom", "canteen"].map((value) => <option key={value}>{value}</option>)}
          </select>
        </div>
        <audio ref={audioRef} src="/sounds/sos-alert.mp3" preload="auto" />
        <button className="sos-button" onClick={send} disabled={hasOpenAlert}>SOS</button>
        {message && <p className="success-text">{message}</p>}
        {alert && (
          <div className="card" style={{ marginTop: 30, textAlign: "left" }}>
            <span className={`badge ${alert.status === "active" ? "red" : "green"}`}>{alert.status}</span>
            <h2>{alert.publicId}</h2>
            <p>Location: {alert.location}</p>
            {alert.status === "active" && <button className="btn ghost" onClick={cancel}>Cancel before acknowledgment</button>}
          </div>
        )}
      </div>
    </AppShell>
  );
}
