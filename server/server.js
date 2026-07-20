const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');

connectDB();
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT;
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const contentRouter = require('./routes/contentRoutes');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(limiter);



// app.get('/', (req, res) => {
//     res.status(201).json({ name: "Himanshu", age: 20 });
// })

app.get('/', (req, res) => {
    res.send('Welcome to the server');
});

// api endpoints
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/content', contentRouter);


// https.createServer(
//     {
//         key: fs.readFileSync('key.pem'),
//         cert: fs.readFileSync('cert.pem')
//     },
//     app).listen(PORT, (err) => {
//         if (!err) {
//             console.log(`server is running on port ${PORT}`);
//         }
//     });

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, (err) => {
        console.log(`server is running on port ${PORT}`);
    });
}

module.exports = app;
