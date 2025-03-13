import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

test('fetches data successfully', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ success: true }) }),
  ) as jest.Mock;

  const { result } = renderHook(() => useFetch('/api/test'));

  await waitFor(() => expect(result.current).not.toBeNull());

  expect(result.current).toEqual({ success: true });
});
