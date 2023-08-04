const { Router } = require("express");
const passport = require("passport");
const EntityDAO = require("../dao/entity.dao");
const multerConfig = require("../config/multer.config");
const nodemailer = require("nodemailer");
const transporter = require("../utils/mail.util");

const Users = new EntityDAO("users");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await Users.getAll(); // Asegúrate de invocar la función getAll() aquí

    const payload = users.map((user) => ({
      nombre: user.first_name, // Corrige el typo "fist_name" a "first_name"
      correo: user.email,
      rol: user.role,
    }));

    res.render("users.handlebars", { payload });
  } catch (error) {
    throw error;
  }
});

router.get("/failregister", (req, res) => {
  console.log("fallo estrategia de registro");
  res.json({ error: "Failed register" });
});

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/users/failregister" }),
  async (req, res) => {
    try {
      res.status(201).json({ status: "success", message: "Usuario creado" });
    } catch (error) {
      console.log(error.message);

      res.status(500).json({ status: "error", error: "error interno" });
    }
  }
);

router.post(
  "/:uid/documents",
  multerConfig.array("documents"),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await Users.getOne(uid);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar si el usuario ya ha subido todos los documentos requeridos
      const hasIncompleteDocument = user.documents.some(
        (doc) => doc.reference === "incomplete"
      );

      if (user.documents.length < 3 || hasIncompleteDocument) {
        // Actualizar el estado de carga de documentos
        user.documents = req.files.map((file) => ({
          name: file.originalname,
          reference: "complete",
        }));
        await user.save();
      }

      res.json({ message: "Archivos subidos exitosamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put("/:uid", async (req, res) => {
  try {
    const id = req.params.uid;
    const info = new UserDTO(req.body);
    const newUser = await Users.update(info, id);
    res.json({ message: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/premium/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await Users.findById(uid);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el usuario ha subido los documentos requeridos
    if (
      user.documents.length < 3 ||
      user.documents.some((doc) => doc.reference !== "complete")
    ) {
      return res.status(400).json({
        error: "El usuario no ha terminado de cargar la documentación",
      });
    }

    // Actualizar al usuario a premium
    user.status = "premium";
    await user.save();

    res.json({ message: "Usuario actualizado a premium exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:uid", async (req, res) => {
  try {
    const id = req.params.uid;
    await Users.delete(id);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const deletedUsersEmails = await deleteInactiveUsers();

    await sendNotificationEmails(deletedUsersEmails);

    res
      .status(200)
      .json({ message: "Usuarios inactivos eliminados y notificados." });
  } catch (error) {
    throw error;
  }
});

async function deleteInactiveUsers() {
  const inactiveUsersThreshold = 10; // Minutos de inactividad para eliminar a un usuario (puedes ajustarlo a 2 días o 30 minutos según tus necesidades)
  let inactiveUsers = await Users.getAll();
  inactiveUsers = inactiveUsers.filter((user) => {
    const lastConnectionTime = new Date(user.last_connection).getTime();
    const currentTime = Date.now();
    const minutesSinceLastConnection =
      (currentTime - lastConnectionTime) / (1000 * 60);
    return minutesSinceLastConnection >= inactiveUsersThreshold;
  });

  const deletedUsersEmails = inactiveUsers.map((user) => user.email);
  console.log(deletedUsersEmails);

  // Eliminar los usuarios inactivos de la base de datos

  await Promise.all(inactiveUsers.map((user) => Users.delete(user._id)));

  return deletedUsersEmails;
}

async function sendNotificationEmails(emails) {
  const mailOptions = {
    from: "molinaroque871@gmail.com",
    to: emails.join(","),
    subject: "Cuenta eliminada por inactividad",
    text: "Tu cuenta ha sido eliminada por inactividad.",
  };

  await transporter.sendMail(mailOptions);
}

module.exports = router;
