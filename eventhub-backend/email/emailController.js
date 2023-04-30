const msgs = require("./emailMsgs");
const sendEmail = require("./sendEmail");
const templates = require("./emailTemplates");
const mysqlConnection = require("../config/dbConnection");
const jwt = require("jsonwebtoken");


exports.confirmEmail = async (req, res) => {
    const { id, token } = req.params;
    console.log(id);

    try {
        if (id && token) {
                mysqlConnection.query(`SELECT * from user where id="${id}"`, (err, rows, fields) => {
                    const user = rows[0];
                    console.log(user);
                    if (err) {
                        return res.status(400).json({"error": err});
                    } 
                    else if (!user)
                        return res.json({ msg: msgs.couldNotFind });

                    else if (user.is_active)
                        return res.status(200).json({ msg: msgs.alreadyConfirmed });


                    else if (user && !user.is_active) {
                            mysqlConnection.query(`UPDATE user SET is_active=1 where id=${id}`, (err, rows, fields) => {
                                if (!err) {
                                    jwt.verify(token, process.env.secretOrKey, function (err, result) {
                                        if (err) {
                                            return res.status(400).json({"err": "token invalid"});
                                        } else {
                                            sendEmail(user.email, templates.verified());
                                            return res.status(200).json({ msg: msgs.confirmed });
                                        }
                                    });
                                    
                                } else {
                                    console.log(err);
                                    return res.status(400);
                                }
                            });
                    }
                    else {
                        return res.json({ msg: "User does not exist. Invalid ID" });
                    }
                });            
        }
        

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};