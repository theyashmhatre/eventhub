const { emailRegex, passwordRegex } = require("./constants");

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function emailValidation(email, errors) {
  if (!email) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email entered is invalid";
  }

  return errors;
}

function passwordsValidation(password, confirmPassword, errors) {
  if (!password) {
    errors.password = "Password field is required";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password field is required";
  }

  if (!isEmptyObject(errors)) return errors;

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (password.length > 40) {
    errors.password = "Password must be less than 40 characters.";
  }

  if (!isEmptyObject(errors)) return errors;

  if (password !== confirmPassword) {
    errors.password = "Passwords must match";
    return errors;
  }

  if (!passwordRegex.test(password)) {
    errors.password =
      "Password must contain atleast 1 uppercase character, lowercase character, special symbol and digit";
  }

  return errors;
}

function generatePaginationValues(req) {
  const { limit, pageNum } = req.params;

  const offset = (pageNum - 1) * limit; //number of rows to skip before selecting records

  return { limit: parseInt(limit), pageNum, offset };
}

function generateCurrentDateTime() {
  var currTime = new Date();
  const newDate = new Date();
  newDate.setTime(currTime.getTime());

  const creationDate = new Date(
    newDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  )
    .toISOString() //2022-09-03T12:12:38.000Z
    .replace(/T/, " ") // replace T with a space
    .replace(/\..+/, ""); // delete the dot and everything after => 2022-09-03 12:28:55 => YYYY-MM-DD HH-MM-SS

  return newDate;
}

function generatePaginationValues(req) {
  const { limit, pageNum } = req.params;

  const offset = (pageNum - 1) * limit; //number of rows to skip before selecting records

  return { limit: parseInt(limit), pageNum, offset };
}

module.exports = {
  isEmptyObject,
  emailValidation,
  passwordsValidation,
  generatePaginationValues,
  generateCurrentDateTime,
};
