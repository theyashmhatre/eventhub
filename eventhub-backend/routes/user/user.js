const router = require("express").Router();
const mysqlConnection = require("../../config/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { isEmptyObject, passwordsValidation } = require("../../utils/utils");
const passport = require("passport");
const emailController = require("../../email/emailController");
const sendEmail = require("../../email/sendEmail");
const templates = require("../../email/emailTemplates");

// Get all users
router.get("/", (req, res) => {
  mysqlConnection.query("SELECT * from user", (err, rows, fields) => {
    if (!err) {
      res.status(200).send(rows);
    } else {
      console.log(err);
      res.status(400);
    }
  });
});

router.post("/register", (req, res) => {
  let { email, password, name, contact, address, city } = req.body;
  console.log(req.body);
  // const { errors, isValid } = validateRegisterParams(req.body); //validating all parameters before registering user

  // if (!isValid) return res.status(400).json(errors);

  mysqlConnection.query(
    `SELECT * from user where email="${email}"`,
    function (error, result, fields) {
      if (error) {
        console.log(error.code, error.sqlMessage);
        res.status(500).json({
          main: "Something went wrong. Please try again",
          devError: error,
          devMsg: "MySql query error",
        });
      }

      if (!isEmptyObject(result)) {
        //check if user email already exists
        if (result[0].email === email)
          return res.status(400).json({ email: "Email already exists" });
      } else {
        //generate passwordHash and create user on database

        bcrypt.hash(password, bcrypt.genSaltSync(10), (err, hash) => {
          if (err) {
            console.log("bcrypt error for password", err);
            res.status(500).json({
              main: "Something went wrong. Please try again.",
              devError: err,
              devMsg: "Error while encrypting password using bcrypt library",
            });
          }

          const user = {
            name: name,
            email: email,
            password: hash,
            contact: contact,
            address: address,
            city: city,
          };

          //adding user to database
          mysqlConnection.query(
            `INSERT INTO user SET ?`,
            user,
            (sqlErr, result, fields) => {
              if (sqlErr) {
                console.log(sqlErr);
                res.status(500).json({
                  main: "Something went wrong. Please try again.",
                  devError: sqlErr,
                  devMsg: "Error occured while adding user into db",
                });
              } else {
                const user_id = result.insertId;
                const payload = {
                  id: user_id,
                  email: user.email,
                  name: user.name,
                };
                jwt.sign(
                  payload,
                  process.env.secretOrKey,
                  {
                    expiresIn: 31556926, // 1 year in seconds
                  },
                  (err, token) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({
                        main: "Something went wrong. Please try again",
                        devError: err,
                        devMsg: "Error while signing jwt token",
                      });
                    } else {
                      //returns jwt token to be stored in browser's sessionStorage
                      sendEmail(email, templates.confirm(user_id, token));
                      return res
                        .status(201)
                        .json({ devMsg: "New user created successfully" });
                    }
                  }
                );
              }
            }
          );
        });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  //validating email and password
  // const { errors, isValid } = validateLoginParams(req.body);

  //Check validation
  // if (!isValid) return res.status(400).json(errors);

  mysqlConnection.query(
    `SELECT * from user where email = "${email}"`,
    function (error, row, fields) {
      if (error) {
        console.log(error.code, error.sqlMessage);
        res.status(500).json({
          main: "Something went wrong. Please try again",
          devError: error,
          devMsg: "MySql query error",
        });
      }

      let user = row[0];

      if (!user) {
        return res
          .status(404)
          .json({ main: "User does not exist. Please register and continue" });
      }
      if (!user.is_active) {
        return res
          .status(400)
          .json({ main: "Account not active yet. Please confirm your email." });
      }

      //Check password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          console.log("ERR", err);
        }
        if (isMatch) {
          // user password verified, Create JWT Payload
          const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
          };

          //Sign token
          jwt.sign(
            payload,
            process.env.secretOrKey,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              if (err) {
                console.log(err);
                res.status(500).json({
                  main: "Something went wrong. Please try again",
                  devError: err,
                  devMsg: "Error while signing jwt token",
                });
              } else {
                //returns jwt token to be stored in browser's sessionStorage
                res.status(200).json({
                  success: true,
                  token: token,
                  user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    contact: user.contact,
                    city: user.city,
                  },
                });
              }
            }
          );
        }
      });
    }
  );
});

router.get(
  "/profile/:userId",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    try {
      const { userId } = req.params;

      if (!userId)
        return res
          .status(400)
          .json({ main: "Invalid Request", devMsg: "No user id found" });

      mysqlConnection.query(
        `SELECT id, email, name, contact, address, city, is_active, created_at from user where id = ${userId}`,
        (sqlErr, result, fields) => {
          if (sqlErr) {
            return res.status(500).json({
              main: "Something went wrong. Please try again.",
              devError: sqlErr,
              devMsg: "Error occured while fetching user from db",
            });
          } else if (!result.length) {
            //if no challenge found with the given challengeID
            console.log("No user found");
            return res.status(200).json({
              main: "User you were looking for doesn't exist.",
              devError: "User not found in database",
            });
          } else {
            let user = result[0];

            return res.status(200).json(user);
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        main: "Something went wrong. Please try again.",
        devError: error,
        devMsg: "Error occured while fetching user",
      });
    }
  }
);

router.post(
  "/update/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      let { name, contact, address, city } = req.body;

      let userId = res.req.user.id;
      console.log(userId);

      // const { errors, isValid } = updateProfileValidation(req.body);  //validating all parameters before updating user

      // if (!isValid) return res.status(400).json(errors);

      const updatedProfile = {
        name,
        contact,
        address,
        city,
      };

      mysqlConnection.query(
        `SELECT *FROM user WHERE id = ${userId}`,
        (sqlErr, result, fields) => {
          if (sqlErr) {
            return res.status(500).json({
              main: "Something went wrong. Please try again.",
              devError: sqlErr,
              devMsg: "Error occured while fetching user from db",
            });
          } else if (!result[0]) {
            //no user found
            return res.status(200).json({
              main: "No such user exists",
              devMsg: "User ID is invalid",
            });
          } else {
            if (result[0].id != res.req.user.id) {
              return res.status(200).json({
                main: "You don't have rights to update",
                devMsg: "User is Unauthorized",
              });
            }

            //storing updating user into db
            mysqlConnection.query(
              `UPDATE user SET ? WHERE id = ?`,
              [updatedProfile, userId],
              (sqlErr, result, fields) => {
                if (sqlErr) {
                  console.log(sqlErr);
                  return res.status(500).json({
                    main: "Something went wrong. Please try again.",
                    devError: sqlErr,
                    devMsg: "Error occured while updating challenge in db",
                  });
                } else {
                  res.status(200).json({
                    main: "User updated Successfully",
                  });
                }
              }
            );
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        main: "Something went wrong. Please try again.",
        devError: error,
        devMsg: "Error occured while updating user profile",
      });
    }
  }
);

router.get("/email/confirm/:id/:token", emailController.confirmEmail);

router.post(
  "/verify/details",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token_val = req.header("Authorization");
    const token = token_val.slice(7);
    if (!token)
      return res.status(400).json({ err: "No header found. Bad Request" });

    const verified = jwt.verify(token, process.env.secretOrKey);

    mysqlConnection.query(
      `SELECT id, email, name, contact, city from user where id=${verified.id}`,
      (sqlErr, result, fields) => {
        if (sqlErr) {
          console.log(sqlErr);
          res.status(500).json({
            main: "Something went wrong. Please try again.",
            devError: sqlErr,
            devMsg: "Error occured while fetching user details from db",
          });
        } else if (!result.length) {
          return res.status(400).json({ err: "No user found. Invalid Token" });
        } else {
          return res.status(200).json(result[0]);
        }
      }
    );
  }
);

router.post(
  "/details",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { email } = req.body;

    mysqlConnection.query(
      `SELECT id, name, email, contact from user where email="${email}"`,
      (sqlErr, result, fields) => {
        if (sqlErr) {
          console.log(sqlErr);
          res.status(500).json({
            main: "Something went wrong. Please try again.",
            devError: sqlErr,
            devMsg: "Error occured while fetching user details from db",
          });
        } else if (!result.length) {
          return res.status(400).json({ err: "No user found. Invalid Email" });
        } else {
          return res.status(200).json(result[0]);
        }
      }
    );
  }
);

module.exports = router;
