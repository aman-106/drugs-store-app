import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

const MongoStore = mongo(session);
import drugController from "./controllers/drugs";
import orderController from "./controllers/order";

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose.Promise = bluebird;
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
    () => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('mongo db connected')
    },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
// app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    // else if (req.user &&  // account page 
    //     req.path == "/account") {
    //     req.session.returnTo = req.path;
    // }
    next();
});

app.use(
    express.static(path.join(__dirname, "public/"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */

// login page
app.get('/', function (req, res) {
    console.log('user', req.user);
    res.sendFile(path.join(__dirname, 'public/client/', 'index.html'));
});

/**
 * get logged user info
 */
app.get('/users/loggedin', passportConfig.isAuthenticated, function (req, res) {
    const basicUserInfo = {
        email: req.user.email,
        _id: req.user._id,
        name: req.user.profile.name,
        picture: req.user.profile.picture,
    };
    res.json({ user: basicUserInfo });
});

app.use("/drugs", passportConfig.isAuthenticated, drugController);
app.use("/orders", passportConfig.isAuthenticated, orderController);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/auth/failure" }), (req, res) => {
    res.redirect(req.session.returnTo || "/users/loggedin");
});

app.get("/auth/failure", function (req, res) {
    res.json({ error: "unable to auth user" });
});

export default app;
