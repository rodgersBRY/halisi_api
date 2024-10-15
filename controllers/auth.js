const bcrypt = require("bcrypt");
const passport = require("passport");

const { throwError } = require("../helpers");
const { addUser, editUser, getUserByEmail } = require("../models/user");
const uploadFromBuffer = require("../helpers/buffer_stream");
const { googleSheetsService } = require("../services/google_sheets_service");

exports.register = async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const userExists = await getUserByEmail(email);

    if (userExists) throwError("An account with that email exists!", 409);

    const hashedPass = await bcrypt.hash(password, 12);

    const userData = {
      name: name,
      email: email,
      phone: phone,
      password: hashedPass,
      role: role || "candidate",
    };

    await addUser(userData);

    // save user to google sheets
    let spreadData = [[name, email, phone, role]];
    await googleSheetsService(spreadData);

    res.status(201).json({ msg: "successfully registered!" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(info.code).json({ msg: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ msg: "Logged in successfully", user });
    });
  })(req, res, next);
};

exports.checkAuth = (req, res) => {
  console.log(req.user);

  res.status(200).json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ msg: "Error logging out" });
    res.status(200).json({ msg: "Logged out successfully" });
  });
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) throwError("Please enter an email address", 401);

    const userExists = await getUserByEmail(email);

    if (!userExists)
      throwError("No user with that email exists. Please register", 404);

    // update password
    const hashedPass = await bcrypt.hash(newPassword, 12);

    userExists.password = hashedPass;

    const updatedUser = await userExists.save();

    res
      .status(201)
      .json({ message: "Password was updated successfully", updatedUser });
  } catch (err) {}
};

exports.updateCV = async (req, res, next) => {
  try {
    if (!req.file) throwError("Attach your CV", 401);

    max_size = 10 * 1024 * 1024;

    if (req.file.size > max_size) throwError("Your file exceeds 10MB");

    const originalName = req.file.originalname.split(".")[0]; // Extract the original filename without extension
    const timestamp = Date.now();

    const file_data = {
      name: originalName,
      timestamp: timestamp,
    };

    const { secure_url } = await uploadFromBuffer(req.file.buffer, file_data);

    const updatedUser = await editUser(req.userId, { cvUrl: secure_url });

    res.status(201).json({ message: "CV uploaded successfully", updatedUser });
  } catch (err) {
    next(err);
  }
};
