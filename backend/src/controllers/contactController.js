const Contact = require("../models/Contact");
const { VALID_EMAIL } = require("../utils/validation");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof name !== "string" || name.trim().length < 1 || name.length > 100) {
      return res.status(400).json({ message: "Name must be between 1 and 100 characters" });
    }

    if (typeof email !== "string" || !VALID_EMAIL.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (typeof subject !== "string" || subject.trim().length < 1 || subject.length > 200) {
      return res.status(400).json({ message: "Subject must be between 1 and 200 characters" });
    }

    if (typeof message !== "string" || message.trim().length < 1 || message.length > 5000) {
      return res.status(400).json({ message: "Message must be between 1 and 5000 characters" });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    const { __v, ...clean } = contact.toObject();

    res.status(201).json({ message: "Message sent successfully", contact: clean });
  } catch (error) {
    console.error("Contact error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
