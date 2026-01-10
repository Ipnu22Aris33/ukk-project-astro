import { mysqlPool } from "../config/mysql";

export const BooksRepo = () => {
  return {
    async createBook(
      title: string,
      author: string,
      publisher: string,
      category: string
    ) {
      const [result] = await mysqlPool.execute(
        "INSERT INTO buku (judul, author, penerbit, kategori) VALUES (?, ?, ?, ?)",
        [title, author, publisher, category]
      );
      return result;
    },
    async getAllBooks() {
      const [rows] = await mysqlPool.execute("SELECT * FROM buku");
      return rows;
    },
  };
};
