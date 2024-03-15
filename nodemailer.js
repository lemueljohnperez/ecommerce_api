const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'group3lemueltoni@gmail.com',
    pass: 'lurk kcbw jgdl qvrk'
  }
});

module.exports = transporter;