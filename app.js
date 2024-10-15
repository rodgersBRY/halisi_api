const express = require("express"),
  logger = require("morgan"),
  cors = require("cors"),
  app = express(),
  path = require("path"),
  { v4: uuidv4 } = require("uuid"),
  session = require("express-session"),
  passport = require("passport"),
  MongoStore = require("connect-mongo"),
  connectDB = require("./services/db");

require("dotenv").config();
require("./services/passport")(passport);

// connect to mongoDB
connectDB();

const authRoutes = require("./routes/auth"),
  jobRoutes = require("./routes/job"),
  applicationRoutes = require("./routes/application"),
  feedbackRoutes = require("./routes/feedback"),
  blogRoutes = require("./routes/blog");

const port = process.env.PORT || 4000;

// Express session middleware
app.use(
  session({
    genid: (req) => {
      return uuidv4();
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // Session expiration time (14 days in this case)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day (in milliseconds)
    },
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app
  .use(logger("dev"))
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use("/uploads", express.static(path.join(__dirname, "uploads")));

const routes = [
  { path: "/api/v1/auth", handler: authRoutes },
  { path: "/api/v1/jobs", handler: jobRoutes },
  { path: "/api/v1/applications", handler: applicationRoutes },
  { path: "/api/v1/feedback", handler: feedbackRoutes },
  { path: "/api/v1/blogs", handler: blogRoutes },
];

routes.forEach((route) => app.use(route.path, route.handler));

app.use("/", (req, res) => {
  res.send("This is the Halisi Travels Official API");
});

app.use((err, req, res, next) => {
  const message = err.message,
    status = err.statusCode || 500,
    data = err.data;

  return res.status(status).json({ error: data, message: message });
});

app.listen(port, () => {
  console.log(`Port ${port} is ready for requests`);
});

module.exports = app;
