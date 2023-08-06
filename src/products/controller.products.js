const { Router } = require("express");
const FilesDao = require("../dao/files.dao");
const Product = require("../dao/models/products.model");
const EntityDAO = require("../dao/entity.dao");
const ProductDTO = require("../DTOs/products.dto");
const transporter  = require("../utils/mail.util");
const passport = require("passport");

const Users = new EntityDAO("users");
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

router.get("/profile", async (req, res) => {
  try {
    // Obtener el usuario actual
    const users = await Users.getAll();
    const currentUser = users.find((user) => user.role);
    console.log("current user: " + currentUser);

    // Verificar si el usuario está autenticado
    if (!currentUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Devolver la información del usuario actual
    res.json({ user: currentUser.role });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Error", error: "An error occurred" });
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
      const updatedProduct = await Products.update(productInfo, productId);
      res.json({ message: updatedProduct });
    } else if (currentUser.role === "premium") {
      const existingProduct = await Products.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (existingProduct.owner !== currentUser.email) {
        return res
          .status(403)
          .json({ error: "You can only modify your own products" });
      }
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
    const users = await Users.getAll();
    const currentUser = users.find((user) => user.role);

    // Verificar si el usuario es admin
    if (currentUser.role === "admin") {
      // Eliminar el producto sin restricciones
      await Products.delete(productId);
      res.json({ message: "Product deleted" });
    } else if (currentUser.role === "premium") {
      // Verificar si el producto pertenece al usuario premium
      const existingProduct = await Products.getOne(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

     

      // Eliminar el producto que pertenece al usuario premium
      await Products.delete(productId);
      await sendNotificationEmails([currentUser.email]);

      res.json({ message: "Product deleted" });
    } else {
      res
        .status(403)
        .json({ error: "You don't have permission to delete products" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "Error", error: "An error occurred" });
  }
});

async function sendNotificationEmails(emails) {
  const mailOptions = {
    from: "molinaroque871@gmail.com",
    to: emails.join(","),
    subject: "Producto eliminado",
    text: "Tu producto ha sido eliminado.",
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;
