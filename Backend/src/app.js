require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(cors({
    origin: "https://ai-interview-assistant-3-7iwm.onrender.com",
    credentials: true
}))
console.log("UPDATED BACKEND DEPLOYED")
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes')

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter)

module.exports = app;