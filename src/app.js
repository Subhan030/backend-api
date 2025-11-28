const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const { BACKEND_PORT } = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const problemRoutes = require('./routes/problem.routes');
const submissionRoutes = require('./routes/submission.routes');
const contestRoutes = require('./routes/contest.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/runner', require('./routes/runner.routes'));
app.use('/api/contests', contestRoutes);
app.use('/api/admin', adminRoutes);

app.get("/health", (req, res) => {
    res.status(200).send("everything working fine!");
});

app.listen(BACKEND_PORT, (err) => {
    if (err) console.log("error :-", err);
    console.log(`server running on the port ${BACKEND_PORT}`);
});

module.exports = app;
