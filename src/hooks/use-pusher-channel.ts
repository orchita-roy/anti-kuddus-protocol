"use client";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export function usePusherChannel(channelName: string, events: string[], onEvent: (data: any) => void) {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY; const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) return;
    const pusher = new Pusher(key, { cluster }); const channel = pusher.subscribe(channelName);
    pusher.connection.bind("connected", () => setConnected(true)); pusher.connection.bind("disconnected", () => setConnected(false));
    for (const event of events) channel.bind(event, onEvent);
    return () => { for (const event of events) channel.unbind(event, onEvent); pusher.unsubscribe(channelName); pusher.disconnect(); };
  }, [channelName, events, onEvent]);
  return connected;
}
