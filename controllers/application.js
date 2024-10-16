const emailClient = require("../services/email");
const { throwError } = require("../helpers");
const {
  allApplications,
  applicationsByUserId,
  applicationById,
  newApplication,
  userApplicationByJobId,
} = require("../models/application");
const uploadFromBuffer = require("../helpers/buffer_stream");
const { getUserById } = require("../models/user");
const { getJobById } = require("../models/job");

exports.getApplications = async (req, res, next) => {
  try {
    const { user, job } = req.query;

    let query = {};

    if (user) query.user = user;
    if (job) query.job = job;

    const applications = await allApplications(query);

    if (!applications) throwError("Applications cannot be retrieved!", 404);

    res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
};

exports.getUserApplications = async (req, res, next) => {
  try {
    const applications = await applicationsByUserId(req.userId);

    if (!applications) throwError("Applications cannot be retrieved!", 404);

    res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const id = req.params.id;

    const application = await applicationById(id);

    if (!application) throwError("Application cannot be retrieved!", 404);

    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

exports.newApplication = async (req, res, next) => {
  const serviceId = process.env.JOBS_SERVICE_ID;
  const templateId = process.env.JOBS_TEMPLATE_ID;

  try {
    const {
      jobId,
      country,
      // skills
    } = req.body;

    const applicationExists = await userApplicationByJobId(jobId, req.userId);

    if (applicationExists)
      throwError("You have already applied for this job", 409);

    if (country == "") throwError("Fill in the required fields", 400);

    let cvUrl = "";

    if (req.file) {
      max_size = 10 * 1024 * 1024;

      if (req.file.size > max_size) throwError("Your file exceeds 10MB");

      const originalName = req.file.originalname.split(".")[0]; // Extract the original filename without extension
      const timestamp = Date.now();

      const file_data = {
        name: originalName,
        timestamp: timestamp,
      };

      const { secure_url } = await uploadFromBuffer(req.file.buffer, file_data);
      cvUrl = secure_url;
    }

    const applicationData = {
      userId: req.userId,
      jobId: jobId,
      cvUrl: cvUrl,
      country: country,
    };

    const result = await newApplication(applicationData);

    // get all email data
    const { name, email, phone } = await getUserById(req.userId);
    const { title } = await getJobById(jobId);

    const emailData = {
      name,
      email,
      phone,
      job: title,
      cvUrl,
      country,
    };

    await emailClient(serviceId, templateId, emailData);

    res.status(201).json({ message: "application submitted!", result });
  } catch (err) {
    next(err);
  }
};
