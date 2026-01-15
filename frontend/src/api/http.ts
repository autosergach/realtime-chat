export async function postJson<TResponse>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as TResponse;
}

export async function getJson<TResponse>(
  url: string,
  headers?: Record<string, string>
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "GET",
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as TResponse;
}
