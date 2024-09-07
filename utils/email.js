const nodemailer = require('nodemailer');

const sendEmail = async function (option){        // option contain about who sending to whome and message
    // CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
//
    const emailOption = {
        from:'"cineflex pvt limted",<supportscineflex@gmail.com',
        to:option.email,
        subject:option.subject,
        text: option.text
    }
   await transporter.sendMail(emailOption);
}


module.exports = sendEmail;