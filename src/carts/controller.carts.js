const { Router } = require("express");
const EntityDAO = require("../dao/entity.dao");
const router = Router();
const Carts = new EntityDAO("carts");
const Products = new EntityDAO("products");
const User = require("../dao/models/users.model");

router.get("/", async (req, res) => {
  try {
    const cart = await Carts.getOne("64df834c2c3e9956494e044f");
    const payload = cart.carts.product;
    res.render("cart.handlebars", { payload });
  } catch (error) {
    throw error;
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const carts = await Carts.getOne(cid);
    const products = carts.product;
    res.json({ message: products });
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

router.post("/add", async (req, res) => {
  try {
    const { productId } = req.body;

    const selectedProduct = await Products.getOne(productId);

    const carrito = await Carts.getOne("64df834c2c3e9956494e044f");

    if (!carrito) {
      const newCart = new Carts({
        carts: {
          product: [selectedProduct],
          quantity: 1,
        },
      });
      await newCart.save();
    } else {
      carrito.carts.product.push(selectedProduct);
      await carrito.save();
    }

    res.redirect("/api/carts");
  } catch (error) {
    throw error;
  }
});

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

    const cart = await Carts.update(products, cid);
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
    const currentUser = req.user;

    if (currentUser.role === "premium") {

      const cart = await Carts.findId(cid);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const productIndex = cart.products.findIndex(
        (product) => product._id.toString() === pid
      );
      if (productIndex !== -1) {
        const product = cart.products[productIndex];
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

router.post("/finalizar", async (req, res) => {
  try {
    const cart = await Carts.getOne("64df834c2c3e9956494e044f");
    cart.carts.product = [];
    await cart.save();

    res.redirect("/api/products");
  } catch (error) {
    throw error;
  }
});
function calculateTotalAmount(products) {
  let totalAmount = 0;
  for (const product of products) {
    totalAmount += product.price * product.quantity;
  }
  return totalAmount;
}
module.exports = router;
