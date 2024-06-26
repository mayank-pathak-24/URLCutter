const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const staticRoute = require('./routes/staticRouter');
const urlRoute = require("./routes/url");
const userRoute = require('./routes/user');
const { connectMongoDB } = require("./connect");
const URL = require('./models/url');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');

const app = express();
const PORT = 8001;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware to parse JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to MongoDB
connectMongoDB("mongodb://127.0.0.1:27017/url")
    .then(() => console.log("MongoDb connected"));

// Define routes and apply middleware
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use('/user', userRoute);
app.use("/", checkAuth, staticRoute);

// Handle short URL redirections
app.get('/url/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate(
        { shortID },
        { 
            $push: { 
                visitHistory: { timestamp: Date.now() }
            }
        }
    );

    if (entry && entry.redirectURL) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send('URL not found');
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
