export class ApiClientError extends Error { constructor(message: string, public code = "REQUEST_ERROR") { super(message); } }
export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const multipart = init?.body instanceof FormData;
  const response = await fetch(url, { ...init, headers: { ...(multipart ? {} : { "Content-Type": "application/json" }), ...init?.headers } });
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new ApiClientError(payload.error?.message ?? "Request failed", payload.error?.code);
  return payload.data as T;
}
