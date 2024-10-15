const app = require("express").Router(),
  upload = require("../services/multer"),
  controller = require("../controllers/application"),
  {ensureAuthenticated} = require("../middleware/authguard");

app
  .route("/")
  .get(ensureAuthenticated, controller.getApplications)
  .post(ensureAuthenticated, upload.single("cv"), controller.newApplication);

app.route("/user").get(ensureAuthenticated, controller.getUserApplications);
app.route("/:id").get(ensureAuthenticated, controller.getApplication);

module.exports = app;
