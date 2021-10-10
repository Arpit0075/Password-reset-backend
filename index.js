const express = require("express");
const app = express();
const mongo = require("./shared/mongo");
const cors = require("cors");
const service = require("./services/users.service");
const { authCheck } = require("./shared/middleware");
require("dotenv").config();
const port = process.env.PORT || 3001;

async function loadApp() {
  try {
    await mongo.connect();

    app.use(cors());

    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Welcome!!");
    });

    //route for forgotpassword
    app.post("/forgotPass", service.forgotPass);

    //routes for login/register
    app.post("/register", service.register);
    app.post("/login", service.login);

    //middlewares
    app.use(authCheck);

    //private routes
    app.put("/resetPass", service.resetPass);

    app.get("/private", (req, res) => {
      //console.log(req.user);
      res.send({ message: "Welcome to Private Route!!" });
    });

    app.listen(port);
  } catch (err) {
    console.log(err);
  }
}
loadApp();
