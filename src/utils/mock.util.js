const { faker } = require("@faker-js/faker");

const createProducts = (quantity) => {
  const products = [];
  for (i = 0; i < quantity; i++) {
    products.push(generateProducts());
  }
  return products;
};

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    code: faker.string.numeric(4),
    price: faker.commerce.price(),
    stock: faker.number.int(100),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  };
};

module.exports = createProducts;
