const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'julian.bernier89@ethereal.email',
      pass: 'kFRYXDDEw8zPf6WKZ2'
  }
});

const send = (info) => {
  return new Promise(async(resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);
      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
      reject(error); 
    }
  });
};

const emailProcessor = async (email, pin) => {
  const info = {
    from: '"Munisys Company" <julian.bernier89@ethereal.email>', // sender address
    to: email, // list of receivers
    subject: "Password reset Pin", // Subject line
    text: "Here is your password reset pin: " + pin + " This pin will expire in 1 day", // plain text body
    html: `<b>Hello,</b><br/>Here is your pin: <b>${pin}</b><br/>This pin will expire in 1 day`, // html body
  };

  try {
    await send(info); // Attendre que l'e-mail soit envoyé
  } catch (error) {
    console.log("Failed to send email:", error); // Log en cas d'erreur
  }
};

  
  


module.exports = { emailProcessor };