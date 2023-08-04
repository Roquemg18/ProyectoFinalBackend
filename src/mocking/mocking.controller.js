const { Router } = require("express");
const CustomError = require("../handlers/CustomError");
const generateProductErrorInfo = require("../handlers/info");
const EnumErrors = require("../handlers/EnumError");
const createProducts = require("../utils/mock.util");

const router = Router();

router.get("/", (req, res) => {
  const product = createProducts(100);
  res.json({ message: product });
});

router.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;
  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    !thumbnail
  ) {
    CustomError.createError({
      name: "product creating error",
      cause: generateProductErrorInfo({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      }),
      message: "Error trying to create product",
      code: EnumErrors.INVALID_TYPES_ERROR,
    });
  }

  const newProduct = {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  };

  res.json({ message: newProduct });
});

module.exports = router;
