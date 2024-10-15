const app = require("express").Router(),
  controller = require("../controllers/job"),
  { ensureAuthenticated } = require("../middleware/authguard");
// isAuthenticated = require("../middleware/authguard");

app
  .route("/")
  .get(controller.getJobs)
  .post(ensureAuthenticated, controller.newJob);

app
  .route("/:id")
  .get(controller.getJob)
  .delete(ensureAuthenticated, controller.deleteJob);

module.exports = app;
