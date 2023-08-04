const { Router } = require("express");
const FilesDao = require("../dao/files.dao");
const Product = require("../dao/models/products.model");
const EntityDAO = require("../dao/entity.dao");
const ProductDTO = require("../DTOs/products.dto");

const ProductsFile = new FilesDao("products.json");
const Products = new EntityDAO("products");
const router = Router();

router.get("/", async (req, res) => {
  const { user } = req.session;
  const {
    limit = 10,
    page = 1,
    sort,
    query,
    category,
    availability,
  } = req.query;

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort && { price: sort === "asc" ? 1 : -1 },
    customLabels: {
      docs: "payload",
      totalDocs: "totalProducts",
      totalPages: "totalPages",
    },
  };

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (availability) {
    filter.availability = availability;
  }

  if (query) {
    filter.$text = { $search: query };
  }

  try {
    const products = await Product.paginate(filter, options);

    const payload = products.payload.map((product) => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
    }));

    const totalPages = products.totalPages;
    const prevPage = products.prevPage || 1;
    const nextPage = products.nextPage || totalPages;
    const currentPage = products.page;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink =
      hasPrevPage &&
      `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;
    const nextLink =
      hasNextPage &&
      `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&availability=${availability}`;

    res.render("products.handlebars", {
      payload,
      totalPages,
      prevPage,
      nextPage,
      currentPage,
      prevLink,
      nextLink,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/loadData", async (req, res) => {
  try {
    const products = await ProductsFile.getItems();
    const newProduct = await Products.insertMany(products);
    res.json({ status: "success", message: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const info = new ProductDTO(req.body); 
    const newProduct = await Products.create(info); 
    res.json({ status: "success", message: newProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Este producto ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const info = new ProductDTO(req.body);
    const currentUser = req.user;

    if (currentUser.role === "admin") {
      // Modificar el producto sin restricciones
      const updatedProduct = await Products.update(productInfo, productId);
      res.json({ message: updatedProduct });
    } else if (currentUser.role === "premium") {
      // Verificar si el producto pertenece al usuario premium
      const existingProduct = await Products.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (existingProduct.owner !== currentUser.email) {
        return res
          .status(403)
          .json({ error: "You can only modify your own products" });
      }

      // Modificar el producto que pertenece al usuario premium
      const updatedProduct = await Products.update(productInfo, productId);
      res.json({ message: updatedProduct });
    } else {
      res
        .status(403)
        .json({ error: "You don't have permission to modify products" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    // Obtener el usuario actual (supongamos que está almacenado en req.user)
    const currentUser = req.user;

    // Verificar si el usuario es admin
    if (currentUser.role === "admin") {
      // Eliminar el producto sin restricciones
      await Products.delete(productId);
      res.json({ message: "Product deleted" });
    } else if (currentUser.role === "premium") {
      // Verificar si el producto pertenece al usuario premium
      const existingProduct = await Products.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (existingProduct.owner !== currentUser.email) {
        return res
          .status(403)
          .json({ error: "You can only delete your own products" });
      }

      // Eliminar el producto que pertenece al usuario premium
      await Products.delete(productId);
      res.json({ message: "Product deleted" });
    } else {
      res
        .status(403)
        .json({ error: "You don't have permission to delete products" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
