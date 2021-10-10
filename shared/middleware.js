const jwt = require("jsonwebtoken");
require("dotenv").config();

const middleware = {
  authCheck(req, res, next) {
    //console.log(req.headers["authtoken"]);

    const token = req.headers["authtoken"];
    if (token) {
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
      } catch (err) {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  },
};

module.exports = middleware;
