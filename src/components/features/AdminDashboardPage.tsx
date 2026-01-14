import { Table, Alert, Container, Placeholder, Form, Button, InputGroup, Dropdown } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import AppProviders from "@components/providers/AppProviders";
import type { Member } from "@server/models/member";
import { toast } from "sonner";

/* =======================
   TABLE SKELETON
======================= */
function TableSkeleton({ rows = 5 }) {
  return (
    <Table bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Class</th>
          <th>Major</th>
          <th>Role</th>
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: 7 }).map((__, j) => (
              <td key={j}>
                <Placeholder animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/* =======================
   DASHBOARD CONTENT
======================= */
function DashboardContent() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = await res.json();
      return json.data;
    },
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((member) =>
      `${member.name} ${member.email} ${member.class} ${member.major}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading) return <TableSkeleton rows={6} />;

  if (error) {
    toast.error((error as Error)?.message ?? "Unexpected error occurred");
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* SEARCH */}
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text>
            <i className="bi bi-search" />
          </InputGroup.Text>
          <Form.Control placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </InputGroup>

        {/* ADD BUTTON */}
        <Button variant="primary">
          <i className="bi bi-plus-lg me-1" />
          Add Member
        </Button>
      </div>

      {/* TABLE */}
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Major</th>
            <th>Role</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center text-muted py-4">
                No members found
              </td>
            </tr>
          )}

          {filteredData.map((member) => (
            <tr key={member.id_member}>
              <td>{member.id_member}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.class}</td>
              <td>{member.major}</td>
              <td>{member.role}</td>
              <td className="text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle size="sm" variant="light" className="border">
                    <i className="bi bi-three-dots-vertical" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <i className="bi bi-eye me-2" />
                      Detail
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <i className="bi bi-pencil me-2" />
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger">
                      <i className="bi bi-trash me-2" />
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

/* =======================
   PAGE
======================= */
export default function AdminDashboardPage() {
  return (
    <AppProviders>
      <Container className="my-4">
        <h2>Admin Dashboard</h2>
        <DashboardContent />
      </Container>
    </AppProviders>
  );
}
