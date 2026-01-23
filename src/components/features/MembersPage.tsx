// MemberPage.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import { useFetch } from "@hooks/useFetch";
import DataTable, { type ActionItem } from "@components/views/DataTable";

interface Member {
  id_member: number;
  name: string;
  email: string;
  class: string;
  major: string;
  phone: string;
}

export default function MemberPage() {
  const { data, loading } = useFetch<Member[]>("/api/members");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="mb-4">
        <h3>Member Management</h3>
        <p className="text-muted">View and manage all organization members</p>
      </div>

      <div className="bg-white rounded shadow-sm">
        <DataTable<Member>
          data={data}
          loading={loading}
          columns={[
            { key: "id_member", title: "ID", width: "80px" },
            { key: "name", title: "Name", width: "150px" },
            { key: "email", title: "Email", width: "200px" },
            { key: "class", title: "Class", width: "100px" },
            { key: "major", title: "Major", width: "150px" },
            { key: "phone", title: "Phone", width: "120px" },
          ]}
          searchable={true}
          searchPlaceholder="Search by name, email, class..."
          actions={{
            items: [
              { label: "View", icon: "bi-eye", onClick: (m) => console.log("View", m) },
              { label: "Edit", icon: "bi-pencil", onClick: (m) => console.log("Edit", m) },
              { label: "Delete", icon: "bi-trash", variant: "danger", onClick: (m) => console.log("Delete", m) },
            ]
          }}
          addButton={{
            label: "Add Member",
            icon: "bi-plus-lg",
            onClick: () => console.log("Add clicked")
          }}
          
          // Pagination
          pagination={true}
          pageSize={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
