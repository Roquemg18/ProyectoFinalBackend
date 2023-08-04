const { Router } = require("express");
const Users = require("../dao/models/users.model");
const InfoCurrentDTO = require("../DTOs/infoCurrent.dto");
const checkUserRole = require("../middlewares/adminAccess.middleware");

const router = Router();

router.get("/current",checkUserRole, (req, res) => {
  if (req.user) {
    const userId = req.user.id;

    Users.findById(userId)
      .then((user) => {
        if (user) {
          const infoFiltrada = new InfoCurrentDTO(user);
          res.json({ infoFiltrada });
        } else {
          res.status(404).json({ message: "Usuario no encontrado" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Error interno del servidor" });
      });
  } else {
    res.status(401).json({ message: "No se ha iniciado sesión" });
  }
});

module.exports = router;
