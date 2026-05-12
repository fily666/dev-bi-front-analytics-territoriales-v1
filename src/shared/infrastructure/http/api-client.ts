const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export interface ApiClient {
  get<T>(path: string, params?: Record<string, string | number | undefined | null>): Promise<T>;
}

export const apiClient: ApiClient = {
  async get<T>(
    path: string,
    params: Record<string, string | number | undefined | null> = {},
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    // Respetamos el Cache-Control del backend: los catálogos tienen
    // max-age=300, las queries analíticas (resumen, ranking, comparativo)
    // no traen header → el navegador no las cachea. TanStack Query sigue
    // siendo el cache primario en memoria.
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw new HttpError(
        `Error ${response.status} en ${path}`,
        response.status,
        body,
      );
    }

    return (await response.json()) as T;
  },
};
