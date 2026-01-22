// pages/BooksPage.tsx
import { useState } from "react";
import { useFetch } from "@hooks/useFetch";
import { useMutation } from "@hooks/useMutation";
import { useModal } from "@hooks/useModal";
import DataTable from "@components/views/DataTable";
import FormModal, { type FieldConfig } from "@components/views/FormModal";
import { type Book } from "@models/book";
import { toast } from "sonner"; // Import toast langsung

/* =====================
   FORM CONFIG
===================== */
const bookFields: FieldConfig[] = [
  { name: "title", label: "Judul Buku", required: true },
  { name: "author", label: "Penulis", required: true },
  { name: "publisher", label: "Penerbit", required: true },
  {
    name: "category",
    label: "Kategori",
    type: "select",
    required: true,
    options: [
      { label: "Fiksi", value: "Fiksi" },
      { label: "Non-Fiksi", value: "Non-Fiksi" },
      { label: "Ilmiah", value: "Ilmiah" },
    ],
  },
  { name: "stock", label: "Stok", type: "number", required: true },
];

const emptyBook = {
  title: "",
  author: "",
  publisher: "",
  category: "",
  stock: 0,
};

/* =====================
   PAGE
===================== */
export default function BooksPage() {
  const [page, setPage] = useState(1);
  const { data = [], loading: fetching, refetch } = useFetch<Book[]>("/api/books");

  // Menggunakan custom hooks
  const modal = useModal<Book>();

  // Mutation hooks
  const createMutation = useMutation(async (bookData: Partial<Book>) => {
    const response = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) throw new Error("Gagal menambah buku");
    return response.json();
  });

  const updateMutation = useMutation(async ({ id, data }: { id: string; data: Partial<Book> }) => {
    const response = await fetch(`/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal memperbarui buku");
    return response.json();
  });

  const deleteMutation = useMutation(async (id: string) => {
    const response = await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Gagal menghapus buku");
    return response.json();
  });

  /* =====================
     HANDLERS dengan Toast Langsung
  ===================== */
  const handleOpenAdd = () => {
    modal.open();
  };

  const handleOpenEdit = (book: Book) => {
    modal.open(book);
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Hapus buku "${book.title}"?`)) return;
    
    try {
      await deleteMutation.mutate(book.id_book);
      toast.success("Sukses", {
        description: "Buku berhasil dihapus",
      });
      refetch?.();
    } catch {
      toast.error("Error", {
        description: "Gagal menghapus buku",
      });
    }
  };

  const handleSave = async (formData: Record<string, any>) => {
    try {
      if (modal.isEditMode && modal.selected) {
        // UPDATE
        await updateMutation.mutate({
          id: modal.selected.id_book,
          data: formData
        });
        toast.success("Sukses", {
          description: "Buku berhasil diperbarui",
        });
      } else {
        // CREATE
        await createMutation.mutate(formData);
        toast.success("Sukses", {
          description: "Buku berhasil ditambahkan",
        });
      }
      
      // Refresh data dan tutup modal
      refetch?.();
      modal.close();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error", {
        description: modal.isEditMode ? "Gagal memperbarui buku" : "Gagal menambahkan buku",
      });
    }
  };

  /* =====================
     TABLE ACTIONS
  ===================== */
  const tableActions = [
    {
      label: "Edit",
      icon: "bi-pencil",
      onClick: handleOpenEdit,
    },
    {
      label: "Delete",
      icon: "bi-trash",
      variant: "danger" as const,
      onClick: handleDeleteBook,
    },
  ];

  /* =====================
     LOADING STATE
  ===================== */
  const loading = fetching || createMutation.loading || updateMutation.loading || deleteMutation.loading;

  /* =====================
     RENDER
  ===================== */
  return (
    <div>
      <h3 className="mb-4">Books</h3>

      <div className="bg-white rounded shadow-sm">
        <DataTable<Book>
          data={data}
          loading={loading}
          columns={[
            { key: "id_book", title: "ID", width: 80 },
            { key: "title", title: "Title" },
            { key: "author", title: "Author" },
            { key: "publisher", title: "Publisher" },
            { key: "category", title: "Category" },
            { key: "stock", title: "Stock", width: 80 },
          ]}
          searchable
          actions={{ items: tableActions }}
          addButton={{
            label: "Add Books",
            icon: "bi-plus-lg",
            onClick: handleOpenAdd,
          }}
          pagination
          pageSize={10}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      <FormModal
        show={modal.show}
        onHide={modal.close}
        title={modal.isEditMode ? "Edit Book" : "Add Book"}
        fields={bookFields}
        initialValue={modal.selected ?? emptyBook}
        onSubmit={handleSave}
        isSubmitting={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
}