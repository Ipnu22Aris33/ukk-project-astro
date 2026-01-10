import type { APIRoute } from "astro";
import { BooksRepo } from "@server/repositories/book.repo";

const booksRepo = BooksRepo();

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title")?.toString();
  const author = formData.get("author")?.toString();
  const publisher = formData.get("publisher")?.toString();
  const category = formData.get("category")?.toString();

  if (!title || !author || !publisher || !category) {
    return new Response(`missing fields ${title}, ${author}, ${publisher}, ${category}`, { status: 400 });
  }

  await booksRepo.createBook(title, author, publisher, category);

  return new Response(null, {
    status: 303,
    headers: {
      location: "/buku",
    },
  });
};
