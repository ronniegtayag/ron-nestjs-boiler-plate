const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
  }
  return body as T;
}
