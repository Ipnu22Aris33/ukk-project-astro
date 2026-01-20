import { useState, useMemo } from "react";
import { Table, InputGroup, Form, Button, Dropdown, Placeholder } from "react-bootstrap";
import { useFetch } from "@hooks/useFetch";
import { toast } from "sonner";
import type { Member } from "@models/member";

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

export default function DashboardContent() {
  const [search, setSearch] = useState("");

  const { data, loading, error } = useFetch<Member[]>("/api/members");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((member) =>
      `${member.name} ${member.address} ${member.class} ${member.major}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  if (loading) return <TableSkeleton rows={6} />;

  if (error) {
    toast.error(error.message || "Unexpected error occurred");
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-3" style={{ minHeight: 50 }}>
        <InputGroup style={{ maxWidth: 320 }}>
          <InputGroup.Text>
            <i className="bi bi-search" />
          </InputGroup.Text>
          <Form.Control placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </InputGroup>

        <Button variant="primary">
          <i className="bi bi-plus-lg me-1" />
          Add Member
        </Button>
      </div>

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Major</th>
            <th>Role</th>
            <th>Actions</th>
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
              <td>{member.address}</td>
              <td>{member.class}</td>
              <td>{member.major}</td>
              <td>{member.phone}</td>
              <td>
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
