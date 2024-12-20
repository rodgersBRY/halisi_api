const userRoutes = require("../routes/users");
const jobRoutes = require("../routes/job");
const applicationRoutes = require("../routes/application");
const feedbackRoutes = require("../routes/feedback");
const blogRoutes = require("../routes/blog");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const express = require("express");
const responseLogger = require("../utils/response");

class ExpressConfig {
  async init(app) {
    app
      .use(helmet())
      .use(logger("dev"))
      .use(
        cors({
          origin: ["http://localhost:8080", "https://halisitravels.com"],
        })
      )
      .use(express.urlencoded({ extended: true }))
      .use(express.json())
      .use(responseLogger)
      .use("/uploads", express.static(path.join(__dirname, "uploads")));

    const routes = [
      { path: "/api/v1/users", handler: userRoutes },
      { path: "/api/v1/jobs", handler: jobRoutes },
      { path: "/api/v1/applications", handler: applicationRoutes },
      { path: "/api/v1/feedback", handler: feedbackRoutes },
      { path: "/api/v1/blogs", handler: blogRoutes },
    ];

    routes.forEach((route) => app.use(route.path, route.handler));

    app.use((err, _, res, __) => {
      const message = err.message,
        status = err.statusCode || 500,
        data = err.data;

      return res.status(status).json({ error: data, message: message });
    });

    return app;
  }
}

module.exports = ExpressConfig;
