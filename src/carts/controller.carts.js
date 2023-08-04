const { Router } = require("express");
const EntityDAO = require("../dao/entity.dao");
const router = Router();
const Carts = new EntityDAO("carts");
const Products = new EntityDAO("products");
const User = require("../dao/models/users.model");

router.get("/", async (req, res) => {
  try {
    const carts = await Carts.findAll();
    res.json({ message: carts });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = await Carts.findId(cid);
    res.json({ message: products });
    //res.render("cart.handlebars",{products})
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await Carts.findId(cid);
    const productsToPurchase = cart.products;

    const purchasedProducts = [];
    const failedProducts = [];

    for (const product of productsToPurchase) {
      const productInStock = await Products.findId(product._id);

      if (productInStock.stock >= product.quantity) {
        º;
        productInStock.stock -= product.quantity;
        await Products.update(productInStock, productInStock._id);

        purchasedProducts.push(product);
      } else {
        failedProducts.push(product._id);
      }
    }

    if (purchasedProducts.length > 0) {
      const ticketData = {
        amount: calculateTotalAmount(purchasedProducts),
        purchaser: req.user.email,
      };

      const createdTicket = await Tickets.createTicket(ticketData);

      cart.products = failedProducts;
      await Carts.update(cart, cid);
    }

    res.json({ purchased: purchasedProducts, failed: failedProducts });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Función auxiliar para calcular el monto total de la compra
function calculateTotalAmount(products) {
  let totalAmount = 0;
  for (const product of products) {
    totalAmount += product.price * product.quantity;
  }
  return totalAmount;
}

router.post("/", async (req, res) => {
  try {
    const cart = [(product = []), (quantity = 0)];

    await Carts.create(cart);

    res.json({ status: "success", message: "carrito creado" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Esta cuenta ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body;
    console.log("llega esto:", products);

    const cart = await Carts.update(products, cid);
    console.log(cart);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    // Obtener el usuario actual (supongamos que está almacenado en req.user)
    const currentUser = req.user;

    // Verificar si el usuario es premium
    if (currentUser.role === "premium") {
      // Verificar si el producto pertenece al usuario premium
      const cart = await Carts.findId(cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (product) => product._id.toString() === pid
      );
      if (productIndex !== -1) {
        const product = cart.products[productIndex];
        // Obtener el usuario propietario del producto desde la base de datos
        const productOwner = await User.findOne({ email: product.owner });
        if (
          productOwner &&
          productOwner._id.toString() === currentUser._id.toString()
        ) {
          return res
            .status(403)
            .json({ error: "You cannot add your own product to the cart" });
        }
      }
    }

    const newCart = await Carts.updateQuantity(cid, pid, quantity);

    res.json({ status: "success", payload: newCart.products[productIndex] });
  } catch (error) {
    res.status(500).json({ status: "error", payload: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    await Carts.deleteProduct(cid, pid);
    res.json({ status: "success", payload: "Producto eliminado del carrito." });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    await Carts.delete(cid);
    res.json({ status: "success", payload: "Carrito eliminado." });
  } catch (error) {
    res.status(500).json({ status: "error", payload: error.message });
  }
});

module.exports = router;
