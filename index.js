const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require('cors');


// instantiate an express app
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

sendMail = (req, res) => {
    const contactContent = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
    };


    const contactOptions = {
        from: contactContent.email,
        to: "arpitdas.dev@gmail.com",
        subject: "[PORTFOLIO] " + contactContent.subject,
        text: `${contactContent.name} <${contactContent.email}> \n${contactContent.message}`,
    };

    transporter.sendMail(contactOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).json({ status: false, message: "Something went wrong!" });
        } else {
            console.log("Email sent: " + info);
            res.status(200).json({ status: true, message: "Email Sent" });
        }
    });

    transporter.close();
};



app.get('/', (req, res) => {
    res.json({ data: "Working!" });
});

app.post('/contact', sendMail);
//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});