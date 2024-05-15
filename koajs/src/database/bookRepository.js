import books from "./books.json" assert { type: "json" };
import fs from "fs";

// Tiếp tục xử lý dữ liệu JSO

/**
 *
 * @returns {[{author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}]}
 */
function getAll() {
  return books;
}

/**
 *
 * @param id
 * @returns {{author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number}}
 */
function getOne(id) {
  return books.data.find((book) => book.id === parseInt(id));
}

/**
 *
 * @param data
 */
function add(data) {
  const updatedBooks = [data, ...books.data];
  console.log(updatedBooks);
  return fs.writeFileSync(
    "./src/database/books.json",
    JSON.stringify({
      data: updatedBooks,
    })
  );
}

export { getOne, getAll, add };
