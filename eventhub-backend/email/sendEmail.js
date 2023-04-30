const nodemailer = require("nodemailer");

// Getting Nodemailer all setup with the credentials for when the 'sendEmail()'
// function is called.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

module.exports = async (to, content) => {

    const contacts = {
        from: `EventHub <${process.env.MAIL_USER}>`,
        to
    };

    // Combining the content and contacts into a single object that can
    // be passed to Nodemailer.
    const email = Object.assign({}, content, contacts);

    // This file is imported into the controller as 'sendEmail'. Because 
    // 'transporter.sendMail()' below returns a promise we can write code like this
    // in the contoller when we are using the sendEmail() function.
    //
    //  sendEmail()
    //   .then(() => doSomethingElse())
    // 
    // If you are running into errors getting Nodemailer working, wrap the following 
    // line in a try/catch. Most likely is not loading the credentials properly in 
    // the .env file or failing to allow unsafe apps in your gmail settings.
    await transporter.sendMail(email);

};