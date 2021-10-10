const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../shared/mongo");
require("dotenv").config();
const mailer = require("../mailer");

//console.log(process.env.JWT_SECRET);

const service = {
  async register(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (user) return res.status(400).send({ error: "User already exists" });

      // Generate Salt & Hash
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);

      //   Insert User
      await db.users.insertOne(req.body);

      res.send({ message: "User registered successfully" });
    } catch (err) {
      console.log("Error Registering User - ", err);
      res.sendStatus(500);
    }
  },

  async login(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (!user) return res.status(400).send({ error: "User doesn't exists" });

      // Check Password
      const isValid = await bcrypt.compare(req.body.password, user.password);
      if (!isValid)
        return res.status(403).send({ error: "Email or password is wrong" });

      // Generate Token
      const authToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.send({ authToken });
    } catch (err) {
      console.log("Error Login User - ", err);
      res.sendStatus(500);
    }
  },

  async forgotPass(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (!user) return res.status(400).send({ error: "User doesn't exists" });

      // Generate Token
      const authToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      //create temp account/document for user with email and tempPassword in tempUsers collecion, storing password in the form of string
      const tempPass = String(
        Math.floor(
          Math.random() * 7545 + Math.random() * 100 + Math.random() * 27 + 957
        )
      );
      const tempUser = await db.tempUsers.insertOne({
        email: req.body.email,
        tempPassword: tempPass,
        // expiresIn: new Date().getTime() + 900 * 1000, //it will expire in 15 minutes, converted it into milliseconds
      });

      //send email to user
      mailer(user.email, tempPass);

      res.send({
        message: "email sent please fill the password within 15 minutes",
        //tempUser: { email: req.body.email, temppassword: tempPass },
        authToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ err: "falied sending email" });
    }
  },

  async resetPass(req, res) {
    //console.log(req.body);
    //we will get email and password from front end
    //check if email exist
    try {
      // Check if user with same email and tempPass exists
      const user = await db.tempUsers.findOne({
        email: req.body.email,
        tempPassword: req.body.tempPass,
      });
      if (!user) {
        res.send({ err: "failed to find such user" });
      }

      // Generate Salt & Hash
      const salt = await bcrypt.genSalt();
      req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

      const updatedUser = db.users.findOneAndUpdate(
        { email: req.user.email },
        {
          $set: { password: req.body.newPassword },
        }
      );
      res.send({ message: "password reset successfull" });

      //delete tempUser in tempUsers collection
      await db.tempUsers.deleteOne({
        email: req.body.email,
        tempPassword: req.body.tempPass,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ err: err });
    }
  },
};

module.exports = service;
