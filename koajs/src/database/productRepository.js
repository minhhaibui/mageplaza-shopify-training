import products from "./products.json" assert { type: "json" };
import fs from "fs";

// Tiếp tục xử lý dữ liệu JSO

/**
 *
 * @returns {[{author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}]}
 */
function getAll() {
  return products;
}

/**
 *
 * @param id
 * @returns {{author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number}}
 */

function updatedOne(id, updatedData) {
  const productIndex = products.data.findIndex((product) => product.id === id);
  if (!productIndex) {
    ctx.status = 404;
    ctx.body = { error: "Product not found" };
    return;
  }
  products.data[productIndex] = { ...products[productIndex], ...updatedData };

  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: products.data,
    })
  );
}

/**
 *
 * @param data
 */
function add(data) {
  const updatedProduct = [data, ...products.data];
  console.log(updatedProduct);
  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: updatedProduct,
    })
  );
}

function remove(id) {
  const productIndex = products.data.findIndex((product) => product.id === id);
  if (!productIndex) {
    ctx.status = 404;
    ctx.body = { error: "Product not found" };
    return;
  }
  products.data.splice(productIndex, 1);
  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: products.data,
    })
  );
}

function getOne(id) {
  const product = products.data.find((product) => product.id === id);
  return product;
}

export { getOne, getAll, add, updatedOne, remove };
