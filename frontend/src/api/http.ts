export async function postJson<TResponse>(
  url: string,
  body: unknown,
  token?: string
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as TResponse;
}

export async function getJson<TResponse>(
  url: string,
  token?: string
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "GET",
    headers: token ? { authorization: `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as TResponse;
}

async function extractErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as { message?: string; error?: string };
      return data.message ?? data.error ?? "Request failed";
    } catch {
      return "Request failed";
    }
  }
  const text = await response.text();
  return text || "Request failed";
}
