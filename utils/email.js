const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'nguyennttps38258@fpt.edu.vn',
      pass: 'avgbbuhtmsmffeko'
    }
  });


module.exports = { transporter };
