const app = require("express").Router(),
  controller = require("../controllers/auth"),
  upload = require("../services/multer"),
  { ensureAuthenticated } = require("../middleware/authguard");

app.post("/register", controller.register);

app.post("/login", controller.login);

app.get("/me", ensureAuthenticated, controller.checkAuth);

app
  .route("/upload")
  .post(ensureAuthenticated, upload.single("cv"), controller.updateCV);

module.exports = app;
