const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "candidate", "employer"],
      default: "candidate",
    },
    cvUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = {
  getUsers: () => User.find(),
  getUser: (query) => User.findOne({ query }),
  getUserById: (id) => User.findById(id),
  getUserByEmail: (email) => User.findOne({ email: email }),
  addUser: (values) => new User(values).save().then((user) => user),
  editUser: (id, values) =>
    User.findByIdAndUpdate(id, values, { upsert: true, new: true }),
};
