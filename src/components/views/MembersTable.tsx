import { useQuery } from "@tanstack/react-query";

export default function MembersTable() {
  const { data, isLoading, error } = useQuery({
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
        {data?.map((m: any) => (
          <tr key={m.id_member}>
            <td>{m.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
