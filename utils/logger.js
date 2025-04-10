const winston = require("winston");
const { LOG_LEVEL, NODE_ENV } = require("../config/env");
const { combine, colorize, timestamp, printf, align, errors, splat, json } =
  winston.format;
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists
const logDirectory = path.join(__dirname, "../logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logger = winston.createLogger({
  level: LOG_LEVEL || "info",
  levels: winston.config.npm.levels,
  format: combine(
    colorize({ all: false }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss",
    }),
    errors({ stack: true }),
    splat(),
    json(),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    ...(NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: path.join(logDirectory, "error.log"),
            level: "error",
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: path.join(logDirectory, "combined.log"),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
});

module.exports = logger;
