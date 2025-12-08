import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
    },
  },
});

// add this option before production
//   defaultOptions: {
//     queries: {
//       staleTime: 1 * 60 * 1000,
//     },
//   },
