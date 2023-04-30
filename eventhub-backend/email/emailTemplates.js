const PORT = process.env.PORT || 3000;
const confirm_html = require("./htmlTemplates/confirm");
const verified_html = require("./htmlTemplates/verified")

module.exports = {

  confirm: (id, token) => ({
    subject: 'Confirmation Email - EventHub',
    html: confirm_html.html(id, token),
    text: `Copy and paste this link: http://localhost:8000/api/user/email/confirm/${id}/${token}`
  }),

  verified: () => ({
    subject: 'Your account has been verified!',
    html: verified_html.html(),
    text: `Copy and paste this link: http://localhost:8000/api/user/`
  }),

  deleted: () => ({
    subject: 'Your account has been successfully deleted!',
    html: `
    <h1 align="center">We'll miss you!</h1>
    <p>Account successfully deleted</p><br>
    <p>Regards,<br>URL Shortner Team</p>
      <a href="https://ur1-sh.herokuapp.com" align="left">URL Shortner</a>
    `,
    text: `Copy and paste this link: https://ur1-sh.herokuapp.com`
  }),

  passwordResetLink: (id, token) => ({
    subject: 'URL Shortner Password Reset',
    html: `
    <h1 align="center">Reset Password</h1>
      <a href='https://ur1-sh.herokuapp.com/password/reset/${id}/${token}'>
        Click here to reset your password
      </a>
    `,
    text: `Copy and paste this link: https://ur1-sh.herokuapp.com/password/reset/${id}/${token}`
  }),

  passwordResetDone: () => ({
    subject: 'Your password has been reset successfully!',
    html: `
    <h2 align="center">Password Reset Successful</h2>
      <a href="https://ur1-sh.herokuapp.com" style="text-align:center">Visit URL Shortner</a>
    `,
    text: `Copy and paste this link: https://ur1-sh.herokuapp.com`
  }),

};
