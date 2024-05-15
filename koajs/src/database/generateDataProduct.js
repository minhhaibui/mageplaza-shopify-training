import { faker } from "@faker-js/faker";
import fs from "fs";
const generateProduct = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  description: faker.commerce.productDescription(),
  product: faker.commerce.product(),
  color: faker.color.colorByCSSColorSpace(),
  createdAt: faker.date.past().toISOString(),
  image: faker.image.url(),
});

// Generate 1000 product entries
const generateProducts = (num) => {
  const products = [];
  for (let i = 0; i < num; i++) {
    products.push(generateProduct());
  }
  return products;
};

// Generate 1000 products and save to a JSON file
const products = generateProducts(1000);

fs.writeFileSync(
  "./src/database/products.json",
  JSON.stringify({
    data: products,
  })
);
