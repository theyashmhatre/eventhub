require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use("/api/user/", require("./routes/user/user"));
app.use("/api/event/", require("./routes/event/event"));

app.use("/api/pay/", require("./routes/payment/payment"));

// Passport Middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

// Function to serve all static files
// inside public directory.
app.use(express.static("assets"));

app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
