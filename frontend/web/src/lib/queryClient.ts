import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  30_000,   // data dianggap fresh selama 30 detik
      gcTime:     300_000,  // cache dipertahankan 5 menit setelah tidak dipakai
      retry:      1,        // coba ulang 1x sebelum menampilkan error
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
