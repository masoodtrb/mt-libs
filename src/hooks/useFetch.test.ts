import { renderHook } from "@testing-library/react";
import { useFetch } from "./useFetch";

test("fetches data successfully", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ success: true }) })
  ) as jest.Mock;

  const { result, waitForNextUpdate } = renderHook(() => useFetch("/api/test"));
  await waitForNextUpdate();
  expect(result.current).toEqual({ success: true });
});
x