import "@testing-library/jest-dom";
import { server } from "./msw/server";
import { resetTestData } from "./msw/handlers";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetTestData();
});
afterAll(() => server.close());