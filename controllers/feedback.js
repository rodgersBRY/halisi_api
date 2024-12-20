const emailService = require("../services/email");
const { throwError } = require("../helpers/error");

exports.webFeedback = async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  const serviceId = process.env.FEEDBACK_SERVICE_ID;
  const templateId = process.env.FEEDBACK_TEMPLATE_ID;

  try {
    if (!name || !email || !phone || !subject || !message)
      throwError("All fields are required", 400);

    const emailBody = {
      name,
      email,
      phone,
      subject,
      message,
    };

    await emailService.sendEmail(serviceId, templateId, emailBody);

    res.status(200).json({ msg: "sent" });
  } catch (err) {
    next(err);
  }
};

exports.bookingFeedback = async (req, res, next) => {
  const { name, email, phone, country, message } = req.body;

  const serviceId = process.env.BOOKINGS_SERVICE_ID;
  const templateId = process.env.APPLY_TEMPLATE_ID;

  try {
    if (!name || !email || !phone || !country || !message)
      throwError("All fields are required", 400);

    const emailBody = {
      name,
      email,
      phone,
      country,
      message,
    };

    await emailService.sendEmail(serviceId, templateId, emailBody);

    res.status(200).json({ msg: "sent" });
  } catch (err) {
    next(err);
  }
};
