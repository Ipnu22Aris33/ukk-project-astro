// pages/LoansPage.tsx
import { useState } from "react";
import { useFetch } from "@hooks/useFetch";
import { useMutation } from "@hooks/useMutation";
import { useModal } from "@hooks/useModal";
import DataTable from "@components/views/DataTable";
import FormModal, { type FieldConfig } from "@components/views/FormModal";
import { type Loan } from "@models/loan";
import { toast } from "sonner";

/* =====================
   FORMAT FUNCTIONS untuk Display
===================== */
const formatDate = (date: Date | string | null) => {
  if (!date) return "-";
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "-";
    
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    borrowed: { label: "Dipinjam", color: "primary" },
    returned: { label: "Dikembalikan", color: "success" },
    overdue: { label: "Terlambat", color: "danger" },
  };
  
  return statusMap[status] || { label: status, color: "secondary" };
};

/* =====================
   FORM CONFIG (SAMA)
===================== */
const loanFields: FieldConfig[] = [
  {
    name: "book_id",
    label: "ID Buku",
    type: "text",
    required: true,
    placeholder: "Masukkan ID buku",
  },
  {
    name: "member_id",
    label: "ID Anggota",
    type: "text",
    required: true,
    placeholder: "Masukkan ID anggota",
  },
  {
    name: "admin_id",
    label: "ID Admin",
    type: "text",
    required: true,
    placeholder: "Masukkan ID admin",
  },
  {
    name: "count",
    label: "Jumlah",
    type: "number",
    required: true,
    placeholder: "Masukkan jumlah buku",
  },
  {
    name: "loan_date",
    label: "Tanggal Pinjam",
    type: "date",
    required: true,
  },
  {
    name: "due_date",
    label: "Tanggal Jatuh Tempo",
    type: "date",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Dipinjam", value: "borrowed" },
      { label: "Dikembalikan", value: "returned" },
      { label: "Terlambat", value: "overdue" },
    ],
  },
];

const emptyLoan = {
  book_id: "",
  member_id: "",
  admin_id: "",
  count: 1,
  loan_date: new Date().toISOString().split("T")[0],
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "borrowed",
};

/* =====================
   PAGE
===================== */
export default function LoansPage() {
  const [page, setPage] = useState(1);
  const { data = [], loading: fetching, refetch } = useFetch<Loan[]>("/api/loans");

  const modal = useModal<Loan>();

  // Mutation hooks
  const createMutation = useMutation(async (loanData: Partial<Loan>) => {
    const response = await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    });
    if (!response.ok) throw new Error("Gagal menambah peminjaman");
    return response.json();
  });

  const updateMutation = useMutation(async ({ id, data }: { id: string; data: Partial<Loan> }) => {
    const response = await fetch(`/api/loans/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Gagal memperbarui peminjaman");
    return response.json();
  });

  const deleteMutation = useMutation(async (id: string) => {
    const response = await fetch(`/api/loans/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Gagal menghapus peminjaman");
    return response.json();
  });

  /* =====================
     HANDLERS
  ===================== */
  const handleOpenAdd = () => {
    modal.open();
  };

  const handleOpenEdit = (loan: Loan) => {
    modal.open(loan);
  };

  const handleDelete = async (loan: Loan) => {
    if (!confirm(`Hapus data peminjaman ID ${loan.id_loan}?`)) return;

    try {
      await deleteMutation.mutate(loan.id_loan);
      toast.success("Sukses", {
        description: "Peminjaman berhasil dihapus",
      });
      refetch?.();
    } catch {
      toast.error("Error", {
        description: "Gagal menghapus peminjaman",
      });
    }
  };

  const handleSave = async (formData: Record<string, any>) => {
    try {
      if (modal.isEditMode && modal.selected) {
        // UPDATE
        await updateMutation.mutate({
          id: modal.selected.id_loan,
          data: formData,
        });
        toast.success("Sukses", {
          description: "Peminjaman berhasil diperbarui",
        });
      } else {
        // CREATE
        await createMutation.mutate(formData);
        toast.success("Sukses", {
          description: "Peminjaman berhasil ditambahkan",
        });
      }

      refetch?.();
      modal.close();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error", {
        description: modal.isEditMode ? "Gagal memperbarui peminjaman" : "Gagal menambahkan peminjaman",
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
      onClick: (loan: Loan) => handleDelete(loan),
    },
  ];

  /* =====================
     LOADING STATE
  ===================== */
  const loading = fetching || createMutation.loading || updateMutation.loading || deleteMutation.loading;

  /* =====================
     RENDER dengan Format Tanggal
  ===================== */
  return (
    <div>
      <h3 className="mb-4">Data Peminjaman</h3>

      <div className="bg-white rounded shadow-sm">
        <DataTable<Loan>
          data={data}
          loading={loading}
          columns={[
            { key: "id_loan", title: "ID", width: 80 },
            { key: "book_id", title: "ID Buku", width: 100 },
            { key: "member_id", title: "ID Anggota", width: 120 },
            { key: "admin_id", title: "ID Admin", width: 100 },
            { key: "count", title: "Jumlah", width: 80 },
            {
              key: "loan_date",
              title: "Tanggal Pinjam",
              render: (value) => formatDate(value),
            },
            {
              key: "due_date",
              title: "Jatuh Tempo",
              render: (value, row) => {
                const formattedDate = formatDate(value);
                const isOverdue = 
                  new Date(value) < new Date() && 
                  row.status !== "returned";
                
                return (
                  <span className={isOverdue ? "text-danger fw-bold" : ""}>
                    {formattedDate}
                    {isOverdue && " ⚠️"}
                  </span>
                );
              },
            },
            {
              key: "return_date",
              title: "Tanggal Kembali",
              render: (value) => formatDate(value),
            },
            {
              key: "status",
              title: "Status",
              width: 120,
              render: (value: string) => {
                const badge = getStatusBadge(value);
                return (
                  <span className={`badge bg-${badge.color}`}>
                    {badge.label}
                  </span>
                );
              },
            },
          ]}
          searchable
          actions={{ items: tableActions }}
          addButton={{
            label: "Tambah Peminjaman",
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
        title={modal.isEditMode ? "Edit Peminjaman" : "Tambah Peminjaman"}
        fields={loanFields}
        initialValue={modal.selected ?? emptyLoan}
        onSubmit={handleSave}
        isSubmitting={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
}