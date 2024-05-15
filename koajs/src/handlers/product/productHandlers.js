import {
  getAll as getAllProduct,
  getOne as getOneProduct,
  add as addProduct,
  updatedOne as updatedProduct,
  remove as removeProduct,
} from "../../database/productRepository.js";

import { faker } from "@faker-js/faker";

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */

const sortProducts = (products, order) => {
  return products.data.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });
};

async function getProducts(ctx) {
  try {
    const products = getAllProduct();
    const limit = parseInt(ctx.query.limit, 10) || 10;
    const page = parseInt(ctx.query.page, 10) || 1;
    const oderBy = ctx.query.sort || "asc";
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let sortedProducts = sortProducts(products, oderBy);
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    ctx.body = {
      page,
      limit,
      total: products.data.length,
      totalPages: Math.ceil(products.data.length / limit),
      data: paginatedProducts,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<{data: {author: string, name: string, id: number}}|{success: boolean, error: *}|{message: string, status: string}>}
 */
async function getProductsById(ctx) {
  try {
    const { id } = ctx.params;
    const fields = ctx.query.fields ? ctx.query.fields.split(",") : null;
    const currenProduct = getOneProduct(id);
    console.log(currenProduct);
    if (!currenProduct) {
      ctx.status = 404;
      ctx.body = { error: "Product not found" };
      return;
    }
    if (fields) {
      const filteredProduct = {};
      fields.forEach((field) => {
        if (currenProduct[field]) {
          filteredProduct[field] = currenProduct[field];
          console.log(filteredProduct);
        }
      });
      ctx.status = 200;
      return (ctx.body = { data: filteredProduct });
    }

    ctx.status = 200;
    return (ctx.body = { data: currenProduct });
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

async function save(ctx) {
  try {
    const postData = ctx.request.body;
    console.log("dsfsd");
    const alreadyProduct = getOneProduct(postData.id);
    if (alreadyProduct)
      return (ctx.body = {
        success: false,
        error: e.message,
      });

    addProduct(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
      postData,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

function updatedProductById(ctx) {
  try {
    const { id } = ctx.params;
    const updatedData = ctx.request.body;
    updatedProduct(id, updatedData);
    ctx.status = 200;
    return (ctx.body = {
      success: true,
      updatedData,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

function deleteProduct(ctx) {
  try {
    const { id } = ctx.params;
    removeProduct(id);
    ctx.status = 200;
    ctx.body = {
      success: true,
    };
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

export default {
  getProducts,
  getProductsById,
  save,
  updatedProductById,
  deleteProduct,
};
