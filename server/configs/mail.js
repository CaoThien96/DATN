const nodemailer = require('nodemailer');
const x = 'Default html'
// async..await is not allowed in global scope, must use a wrapper
exports.sendOne = async (
  emailTo,
  subject = 'Defaul subject',
  text = 'Default text',
  html = `<b>${x}</b>`,
) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const account = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'caothien029@gmail.com',
      pass: 'thien201442621996',
    },
  });
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });
  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Fred Foo 👻"caothien029@gmail.com', // sender address
    to: emailTo, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
    // attachments: [
    //   {   // utf-8 string as an attachment
    //     filename: 'text1.txt',
    //     content: 'hello world!'
    //   },
    // ]
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
