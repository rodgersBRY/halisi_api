const app = require("express").Router(),
  controller = require("../controllers/blogs"),
  { ensureAuthenticated } = require("../middleware/authguard");

app
  .route("/")
  .get(controller.getBlogs)
  .post(ensureAuthenticated, controller.newBlog);

app
  .route("/:id")
  .get(controller.getBlog)
  .delete(ensureAuthenticated, controller.deleteBlog);

module.exports = app;
