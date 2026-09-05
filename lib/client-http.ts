export type ApiResult = Record<string, unknown> & {
  error?: string;
  message?: string;
};

export async function postJson(path: string, body: unknown): Promise<ApiResult> {
  return sendJson(path, "POST", body);
}

export async function patchJson(path: string, body: unknown): Promise<ApiResult> {
  return sendJson(path, "PATCH", body);
}

async function sendJson(path: string, method: "POST" | "PATCH", body: unknown): Promise<ApiResult> {
  try {
    const response = await fetch(path, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    const result = text ? JSON.parse(text) as ApiResult : {};
    if (!response.ok && !result.error) result.error = "The request could not be completed.";
    return result;
  } catch {
    return { error: "We could not reach Displyfy. Check your connection and try again." };
  }
}
