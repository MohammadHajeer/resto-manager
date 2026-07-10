import { useQuery } from "@tanstack/react-query";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api").replace(/\/$/, "");

export function useServerHealth() {
  return useQuery({
    queryKey: ["server-health"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/health`);

      if (!response.ok) {
        throw new Error("Server is not healthy");
      }

      return response.json();
    },

    refetchInterval: 30000, // check every 30 seconds
    retry: 1,
    refetchOnWindowFocus: true,
  });
}