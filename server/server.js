require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// User registration 
app.post('/SignUp', async (req, res) => {
    let { username, email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    email = email.toLowerCase();
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }
    try {
        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed }); // email is now lowercased
        await user.save();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// User login
app.post('/Login', async (req, res) => {
    let { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    email = email.toLowerCase();
    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

console.log("MONGO_URI:", process.env.MONGO_URI);