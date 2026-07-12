"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { usePusherChannel } from "@/hooks/use-pusher-channel";
import { apiRequest } from "@/lib/api/client";

type Alert = {
  publicId: string;
  location: string;
  status: string;
  createdAt: string;
};

const events = ["sos-created", "sos-acknowledged", "sos-resolved", "sos-cancelled"];

export default function CaptainSos() {
  const [items, setItems] = useState<Alert[]>([]);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const knownActiveIds = useRef<Set<string>>(new Set());
  const hasLoadedAlerts = useRef(false);

  const load = useCallback(() => {
    void apiRequest<Alert[]>("/api/captain/sos")
      .then((alerts) => {
        setItems(alerts);
        setError("");
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const connected = usePusherChannel(
    "captain-sos",
    events,
    useCallback(() => load(), [load]),
  );

  useEffect(() => {
    const audio = new Audio("/sounds/sos-alert.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const activeIds = items
      .filter((item) => item.status === "active")
      .map((item) => item.publicId);

    if (!hasLoadedAlerts.current) {
      knownActiveIds.current = new Set(activeIds);
      hasLoadedAlerts.current = true;
      return;
    }

    const hasNewAlert = activeIds.some((id) => !knownActiveIds.current.has(id));
    knownActiveIds.current = new Set(activeIds);

    if (hasNewAlert && soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => {
        setSoundEnabled(false);
        setError("Browser blocked alert audio. Press Enable alert sound again.");
      });
    }
  }, [items, soundEnabled]);

  useEffect(() => {
    load();
    if (connected) return;
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [load, connected]);

  function toggleSound() {
    const audio = audioRef.current;
    if (!audio) return;

    if (soundEnabled) {
      audio.pause();
      audio.currentTime = 0;
      setSoundEnabled(false);
      return;
    }

    audio.currentTime = 0;
    setSoundEnabled(true);
    setError("");
    void audio.play().catch(() => {
      setSoundEnabled(false);
      setError("Could not play the alert audio. Check this tab's sound permission.");
    });
  }

  async function action(id: string, type: "acknowledge" | "resolve") {
    await apiRequest(`/api/captain/sos/${id}/${type}`, { method: "PATCH" });
    load();
  }

  return (
    <AppShell title="Live SOS queue">
      <div className="actions" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="eyebrow">Identity-safe rescue network</div>
          <h1>Rescue dispatch.</h1>
        </div>
        <div className="actions">
          <span className={`badge ${connected ? "green" : ""}`}>
            {connected ? "Realtime connected" : "Polling every 10 seconds"}
          </span>
          <button
            className={`btn ${soundEnabled ? "success" : "ghost"}`}
            type="button"
            aria-pressed={soundEnabled}
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? "Alert sound on" : "Enable alert sound"}
          </button>
        </div>
      </div>

      <p className="muted">
        Enable sound once in this tab. A preview will play now, then the same sound will play for every new SOS.
      </p>

      {error && (
        <div className="card error">
          {error} <button className="btn" onClick={load}>Retry</button>
        </div>
      )}

      <div className="grid">
        {items.length ? items.map((item) => (
          <div
            className="card"
            key={item.publicId}
            style={{ gridColumn: "span 6", borderColor: item.status === "active" ? "#8a2936" : undefined }}
          >
            <span className={`badge ${item.status === "active" ? "red" : "green"}`}>{item.status}</span>
            <h2 style={{ marginTop: 14 }}>{item.location.toUpperCase()}</h2>
            <p>{item.publicId} · {new Date(item.createdAt).toLocaleString()}</p>
            <div className="actions">
              {item.status === "active" && (
                <button className="btn primary" onClick={() => action(item.publicId, "acknowledge")}>Acknowledge</button>
              )}
              {["active", "acknowledged"].includes(item.status) && (
                <button className="btn success" onClick={() => action(item.publicId, "resolve")}>Resolve</button>
              )}
            </div>
          </div>
        )) : (
          <div className="card empty" style={{ gridColumn: "span 12" }}>No alerts. Class 7B is clear.</div>
        )}
      </div>
    </AppShell>
  );
}
