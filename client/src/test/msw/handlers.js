import { http, HttpResponse } from "msw";

// AuthContext uses: import.meta.env.VITE_API_URL || "http://localhost:5050"
const API_BASE_URL = "http://localhost:5050";

 // In-memory test store
let users = [
  { _id: "user-1", email: "test@example.com", password: "password123" },
];

let itemsByUser = {
  "user-1": [
    {
      _id: "item-1",
      name: "Oat drink",
      amount: "2",
      notes: "Barista edition",
      isChecked: false,
      userId: "user-1",
    },
  ],
};

function getUserIdFromAuthHeader(request) {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const [, token] = auth.split(" ");
  if (!token) return null;

  // Simple token format: "token-user-1"
  if (!token.startsWith("token-")) return null;
  return token.replace("token-", "");
}

// Exported so tests can reset state when they need to.
export function resetTestData() {
  users = [{ _id: "user-1", email: "test@example.com", password: "password123" }];
  itemsByUser = {
    "user-1": [
      {
        _id: "item-1",
        name: "Oat drink",
        amount: "2",
        notes: "Barista edition",
        isChecked: false,
        userId: "user-1",
      },
    ],
  };
}

export const handlers = [
    
  // AUTH

  // POST /auth/login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Return token in the same structure as the backend
    // backend returns: { token }
    return HttpResponse.json({ token: `token-${user._id}` }, { status: 200 });
  }),

  // POST /auth/register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return HttpResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const exists = users.some((u) => u.email === email);
    if (exists) {
      return HttpResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const newUser = {
      _id: `user-${users.length + 1}`,
      email,
      password,
    };
    users.push(newUser);
    itemsByUser[newUser._id] = [];

    // Backend returns 201 with { message: "User created" }
    return HttpResponse.json({ message: "User created" }, { status: 201 });
  }),

  // GET /auth/me
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const user = users.find((u) => u._id === userId);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Match the backend: returns user object without passwordHash
    return HttpResponse.json(
      { _id: user._id, email: user.email, createdAt: new Date().toISOString() },
      { status: 200 }
    );
  }),

  // SHOP ITEMS

  // GET /shopItem
  http.get(`${API_BASE_URL}/shopItem`, ({ request }) => {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    return HttpResponse.json(itemsByUser[userId] ?? [], { status: 200 });
  }),

  // POST /shopItem
  http.post(`${API_BASE_URL}/shopItem`, async ({ request }) => {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    const newItem = {
      _id: `item-${Date.now()}`,
      name: body.name ?? "",
      amount: body.amount ?? "",
      notes: body.notes ?? "",
      isChecked: Boolean(body.isChecked),
      userId,
    };

    itemsByUser[userId] = itemsByUser[userId] ?? [];
    itemsByUser[userId].push(newItem);

    // Backend returns Mongo insert result - frontend doesn't use it, so instead return this.
    return HttpResponse.json({ insertedId: newItem._id }, { status: 201 });
  }),

  // PATCH /shopItem/:id
  http.patch(`${API_BASE_URL}/shopItem/:id`, async ({ request, params }) => {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));

    const list = itemsByUser[userId] ?? [];
    const idx = list.findIndex((i) => i._id === id);
    if (idx === -1) {
      return HttpResponse.text("Item not found", { status: 404 });
    }

    list[idx] = { ...list[idx], ...body };
    return HttpResponse.json(list[idx], { status: 200 });
  }),

  // DELETE /shopItem/:id
  http.delete(`${API_BASE_URL}/shopItem/:id`, ({ request, params }) => {
    const userId = getUserIdFromAuthHeader(request);
    if (!userId) {
      return HttpResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = params;

    const list = itemsByUser[userId] ?? [];
    const idx = list.findIndex((i) => i._id === id);
    if (idx === -1) {
      return HttpResponse.text("Item not found", { status: 404 });
    }

    list.splice(idx, 1);
    return HttpResponse.json({ deletedCount: 1 }, { status: 200 });
  }),
];