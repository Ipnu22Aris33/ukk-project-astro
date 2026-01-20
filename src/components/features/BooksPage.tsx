// MemberPage.tsx
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "sonner";
import { useFetch } from "@hooks/useFetch";
import DataTable, { type ActionItem } from "@components/views/DataTable";
import { type Book } from "@server/models/book";

export default function BooksPage() {
  const { data, loading } = useFetch<Book[]>("/api/books");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="mb-4">
        <h3>Books</h3>
        {/* <p className="text-muted">View and manage all organization members</p> */}
      </div>

      <div className="bg-white rounded shadow-sm">
        <DataTable<Book>
          data={data}
          loading={loading}
          columns={[
            { key: "id_book", title: "ID", width: "80px" },
            { key: "title", title: "Title", width: "150px" },
            { key: "author", title: "Author", width: "200px" },
            { key: "publisher", title: "Publisher", width: "100px" },
            { key: "stock", title: "Stock", width: "150px" },
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
            label: "Add Books",
            icon: "bi-plus-lg",
            onClick: () => console.log("Add clicked")
          }}
          minRows={1}
          
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
