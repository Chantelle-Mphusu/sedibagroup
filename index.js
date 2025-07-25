require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "https://sedibagroup.co.bw",
  methods: ["POST"],
}));

app.use(express.json());


console.log("Email config:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_TO:", process.env.EMAIL_TO);
console.log("SMTP HOST: us2.smtp.mailhostbox.com");

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

 
  if (!name || !email || !message) {
    console.warn("Validation failed - missing fields");
    return res.status(400).json({ error: "All fields are required" });
  }

 
  const transporter = nodemailer.createTransport({
    host: "us2.smtp.mailhostbox.com",
    port: 587,             
    secure: false,         
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  
  transporter.verify((error, success) => {
    if (error) {
      console.error("Transporter verification failed:", error);
    } else {
      console.log("Server is ready to send messages");
    }
  });


  const mailOptions = {
    from: process.env.EMAIL_USER,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: "New Contact Form Message",
    html: `
      <h3>New Contact Form Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.response);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
