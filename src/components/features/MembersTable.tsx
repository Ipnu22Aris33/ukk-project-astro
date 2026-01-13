// src/components/MembersPage.tsx
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function MembersPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <MembersTableContent />
    </QueryClientProvider>
  );
}

function MembersTableContent() {
  const {
    data: members,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await fetch("/api/members");
      const json = await res.json();
      return json.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <table className="table">
      <tbody>
        {members?.map((m: any) => (
          <tr key={m.id_member}>
            <td>{m.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
