import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // add this option before production
  //   defaultOptions: {
  //     queries: {
  //       staleTime: 1 * 60 * 1000,
  //     },
  //   },
});
