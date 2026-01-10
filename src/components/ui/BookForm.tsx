import React, { useState } from "react";
import { Input, Select, Button } from "webcoreui/react";
import { useFetch } from "src/hooks/useFetch";

export const BookForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [category, setCategory] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { call: createBook, loading, error } = useFetch("/api/books");

  const handleSubmit = async () => {
    if (!title || !author || !publisher || !category) {
      alert("Lengkapi semua field!");
      return;
    }

    const result = await createBook({ title, author, publisher, category });

    if (result) {
    
      setSuccessMsg(result.message);

      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {successMsg && (
        <p className="text-green-500 font-medium">{successMsg}</p>
      )}

      <Input
        label="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        label="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Input
        label="Penerbit"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
      />

      <Select
        name="category"
        label="Kategori"
        value={category}
        onChange={(e) => setCategory(e.value)}
        itemGroups={[
          {
            title: "Kategori",
            items: [
              { value: "Fiksi", name: "Fiksi" },
              { value: "Non-Fiksi", name: "Non-Fiksi" },
              { value: "Teknologi", name: "Teknologi" },
              { value: "Sains", name: "Sains" },
            ],
          },
        ]}
      />

      <Button color="primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Mengirim..." : "Tambah"}
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
