const MONGO_URI = process.env["MONGO_URI"];
const PORT = process.env["PORT"];
const JWT_SECRET_TOKEN = process.env["JWT_SECRET_TOKEN"];

const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_SECRET_KEY = process.env["CLOUDINARY_SECRET_KEY"];
const CLOUDINARY_NAME = process.env["CLOUDINARY_NAME"];

const EMAIL_PUBLIC_KEY = process.env["EMAIL_PUBLIC_KEY"];
const EMAIL_PRIVATE_KEY = process.env["EMAIL_PRIVATE_KEY"];

const FEEDBACK_SERVICE_ID = process.env["FEEDBACK_SERVICE_ID"];
const BOOKINGS_SERVICE_ID = process.env["BOOKINGS_SERVICE_ID"];
const JOBS_SERVICE_ID = process.env["JOBS_SERVICE_ID"];

const FEEDBACK_TEMPLATE_ID = process.env["FEEDBACK_TEMPLATE_ID"];
const APPLY_TEMPLATE_ID = process.env["APPLY_TEMPLATE_ID"];
const JOBS_TEMPLATE_ID = process.env["JOBS_TEMPLATE_ID"];

const GCLOUD_PROJECT = process.env["GCLOUD_PROJECT"];
const GOOGLE_CLIENT_EMAIL = process.env["GOOGLE_CLIENT_EMAIL"];
const GOOGLE_PRIVATE_KEY = process.env["GOOGLE_PRIVATE_KEY"];
const SHEET_ID = process.env["SHEET_ID"];
const TAB_NAME = process.env["TAB_NAME"];

module.exports = {
  MONGO_URI,
  PORT,
  JWT_SECRET_TOKEN,
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRET_KEY,
  EMAIL_PRIVATE_KEY,
  EMAIL_PUBLIC_KEY,
  FEEDBACK_SERVICE_ID,
  FEEDBACK_TEMPLATE_ID,
  BOOKINGS_SERVICE_ID,
  APPLY_TEMPLATE_ID,
  JOBS_SERVICE_ID,
  JOBS_TEMPLATE_ID,
  GCLOUD_PROJECT,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  SHEET_ID,
  TAB_NAME,
};
