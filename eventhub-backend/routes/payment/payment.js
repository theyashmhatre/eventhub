const router = require("express").Router();
const mysqlConnection = require("../../config/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");
const Razorpay = require("razorpay");

var instance = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});


router.post("/order", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { amount, user_id, event_id, ticket_count } = req.body;
    console.log("event", event_id);
    var options = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        notes: {
            "user_id": user_id,
            "event_id": event_id,
            "ticket_count": ticket_count
        }
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            return res.status(400).json({"error": err});
        } else {
            var d = new Date();
            d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const order_object = {
                user_id: user_id,
                event_id: event_id,
                order_id: order.id,
                order_created_at: d.toISOString(),
                amount: amount,
                currency: options.currency,
                ticket_count: ticket_count
            };
            mysqlConnection.query(`INSERT into payment SET ?`, order_object, (sqlErr, result, fields) => {
                if (sqlErr) {
                    console.log(sqlErr);
                    return res.status(500).json({
                        main: "Something went wrong. Please try again.",
                        devError: sqlErr,
                        devMsg: "Error occured while adding user into db",
                    });
                } else {
                    return res.status(201).json(order);
                }
            });
        }
    });
});


router.post("/payment", passport.authenticate("jwt", { session: false }), (req, res) => {
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    generated_signature.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);
    let order_id = req.body.razorpay_order_id;
    let {ticket_count, event_id} = req.body;
    if (generated_signature.digest('hex') === req.body.razorpay_signature) {
        payment_object = {
            payment_id: req.body.razorpay_payment_id,
            is_payment_success: 1
        };
        mysqlConnection.query(`UPDATE payment SET ? WHERE order_id="${order_id}"`, payment_object, (sqlErr, result, fields) => {
            if (sqlErr) {
                console.log(sqlErr);
                return res.status(500).json({
                    main: "Something went wrong. Please try again.",
                    devError: sqlErr,
                    devMsg: "Error occured while updating payment in db",
                });
            } else if (!result.affectedRows){
                return res.status(400).json({
                    main:"No fields updated. Order ID invalid"
                });
            } else {
                mysqlConnection.query(`UPDATE event SET ticket_sold = ticket_sold + ${ticket_count} WHERE id=${event_id}`, (sqlErr, result, fields) => {
                    if (sqlErr) {
                        console.log(sqlErr);
                        return res.status(500).json({
                            main: "Something went wrong. Ticket sold count could not be updated.",
                            devError: sqlErr,
                            devMsg: "Error occured while updating payment in db",
                        });
                    } else {
                        return res.status(201).json({ main: `Payment Created Successfully ${payment_object.payment_id}` });
                    }
                });
            }
        });
    }
    else {
        return res.status(400).send('failed');
    }
});

module.exports = router;