const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3000';

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('pctd_token')
      : null;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',

        ...(token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {}),

        ...options.headers,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(data.message ?? 'Erro na requisição');
  }

  return data;
}