const BASE_URL = 'https://k8s.mectest.ru/test-app';
const AUTH_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
      ...options?.headers,
    },
  });

  const json = await response.json();
  return json as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
};
