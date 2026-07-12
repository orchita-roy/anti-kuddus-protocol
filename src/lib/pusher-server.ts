import "server-only";
import Pusher from "pusher";

function getPusher() {
  const { PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER } = process.env;
  if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) return null;
  return new Pusher({ appId: PUSHER_APP_ID, key: PUSHER_KEY, secret: PUSHER_SECRET, cluster: PUSHER_CLUSTER, useTLS: true });
}

export async function publishSosEvent(event: string, alert: { publicId: string; location: string; status: string; createdAt?: Date }) {
  const pusher = getPusher();
  if (!pusher) return false;
  await Promise.race([
    pusher.trigger("captain-sos", event, alert),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Realtime publish timed out")), 5000)),
  ]);
  return true;
}
