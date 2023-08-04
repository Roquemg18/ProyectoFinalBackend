const checkUserRole = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else if (req.user.role === "user") {
    if (req.originalUrl.includes("/productos") && req.method !== "GET") {
      next();
    } else if (req.originalUrl.includes("/chat") && req.method === "POST") {
      next();
    } else if (req.originalUrl.includes("/carrito") && req.method === "POST") {
      next();
    } else {
      res.status(403).json({ message: "Acceso denegado" });
    }
  } else {
    res.status(401).json({ message: "No se ha iniciado sesión" });
  }
};

module.exports = checkUserRole;
