import { request as pwRequest, APIRequestContext, expect } from "@playwright/test";

const BACKEND_URL = process.env.E2E_BACKEND_URL ?? "http://localhost:5050";

export async function createApiContext(): Promise<APIRequestContext> {
  return await pwRequest.newContext({ baseURL: BACKEND_URL });
}

export function uniqueEmail(prefix = "e2e"): string {
  const now = Date.now();
  return `${prefix}.${now}.${Math.random().toString(16).slice(2)}@example.com`;
}

export async function register(api: APIRequestContext, email: string, password: string) {
  const res = await api.post("/auth/register", { data: { email, password } });
  // 201 expected; if re-running locally with the same email, we may get a 409
  expect([201, 409]).toContain(res.status());
  return res;
}

export async function login(api: APIRequestContext, email: string, password: string): Promise<string> {
  const res = await api.post("/auth/login", { data: { email, password } });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.token).toBeTruthy();
  return body.token as string;
}

export async function createItem(
  api: APIRequestContext,
  token: string,
  item: { name: string; amount?: string; notes?: string; isChecked?: boolean }
) {
  const res = await api.post("/shopItem", {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: item.name,
      amount: item.amount ?? "",
      notes: item.notes ?? "",
      isChecked: item.isChecked ?? false,
    },
  });
  expect(res.status()).toBe(201);
  return res;
}