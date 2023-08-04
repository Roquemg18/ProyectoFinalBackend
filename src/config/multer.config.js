const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configurar multer para guardar archivos en diferentes carpetas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { uid } = req.params;
    const fileType = file.mimetype.split("/")[0];
    let uploadPath = "";

    if (fileType === "image") {
      uploadPath = "./uploads/profiles/";
    } else if (fileType === "application") {
      uploadPath = "./uploads/documents/";
    } else {
      uploadPath = "./uploads/products/";
    }

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
