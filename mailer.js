const nodemailer = require("nodemailer");
require("dotenv").config();

const mailer = (email, tempPass) => {
  //step-1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  //step-2
  let mailOptions = {
    from: process.env.USER, //my email
    to: email, //recepient email

    //to: "pisalox938@neragez.com", //temp Email for testing

    subject: "One time pin for resetting password, valid for 15 minutes ",
    text: `Please enter the pin :${tempPass} `,
  };

  //step-3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`email sent!! ${data.response} `);
    }
  });
};

module.exports = mailer;
