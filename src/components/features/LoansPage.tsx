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
   TIPE UNTUK FORM DATA
===================== */
interface LoanFormData {
  id_loan?: string;
  book_id: string;
  member_id: string;
  admin_id: string;
  count: number;
  loan_date: string; // String untuk input date
  due_date: string; // String untuk input date
  return_date?: string | null;
  status: string;
}

/* =====================
   FORMAT FUNCTIONS untuk Display dan Form
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

// Format tanggal untuk input type="date" (YYYY-MM-DD)
const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return "";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    // Adjust for timezone offset
    const offset = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() - offset);

    return localDate.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Convert form data to Loan type (string dates to Date objects)
const convertFormDataToLoan = (formData: LoanFormData): Partial<Loan> => {
  const loanData: Partial<Loan> = {
    book_id: formData.book_id,
    member_id: formData.member_id,
    admin_id: formData.admin_id,
    count: formData.count,
    status: formData.status,
  };

  // Convert date strings to Date objects
  if (formData.loan_date) {
    loanData.loan_date = new Date(formData.loan_date);
  }

  if (formData.due_date) {
    loanData.due_date = new Date(formData.due_date);
  }

  if (formData.return_date) {
    loanData.return_date = new Date(formData.return_date);
  }

  return loanData;
};

// Convert Loan to form data (Date objects to string)
const convertLoanToFormData = (loan: Loan): LoanFormData => {
  return {
    id_loan: loan.id_loan,
    book_id: loan.book_id,
    member_id: loan.member_id,
    admin_id: loan.admin_id,
    count: loan.count,
    loan_date: formatDateForInput(loan.loan_date),
    due_date: formatDateForInput(loan.due_date),
    return_date: formatDateForInput(loan.return_date),
    status: loan.status,
  };
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
   FORM CONFIG
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

const emptyLoanForm: LoanFormData = {
  book_id: "",
  member_id: "",
  admin_id: "",
  count: 1,
  loan_date: formatDateForInput(new Date()),
  due_date: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  status: "borrowed",
};

/* =====================
   PAGE
===================== */
export default function LoansPage() {
  const [page, setPage] = useState(1);
  const { data = [], loading: fetching, refetch } = useFetch<Loan[]>("/api/loans");

  // Gunakan LoanFormData untuk modal
  const modal = useModal<LoanFormData>();

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
    const formData = convertLoanToFormData(loan);
    modal.open(formData);
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
      // Konversi form data ke tipe LoanFormData
      const loanFormData = formData as LoanFormData;

      // Konversi count ke number
      loanFormData.count = parseInt(loanFormData.count.toString()) || 1;

      // Convert form data to Loan type
      const loanData = convertFormDataToLoan(loanFormData);

      if (modal.isEditMode && modal.selected && modal.selected.id_loan) {
        // UPDATE
        await updateMutation.mutate({
          id: modal.selected.id_loan,
          data: loanData,
        });
        toast.success("Sukses", {
          description: "Peminjaman berhasil diperbarui",
        });
      } else {
        // CREATE
        await createMutation.mutate(loanData);
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
            { key: "book_id", title: "ID Buku", width: 80 },
            { key: "member_id", title: "ID Anggota", width: 80 },
            { key: "admin_id", title: "ID Admin", width: 80 },
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
                const isOverdue = new Date(value) < new Date() && row.status !== "returned";

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
                return <span className={`badge bg-${badge.color}`}>{badge.label}</span>;
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
        initialValue={modal.selected ?? emptyLoanForm}
        onSubmit={handleSave}
        isSubmitting={createMutation.loading || updateMutation.loading}
      />
    </div>
  );
}
