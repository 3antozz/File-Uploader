const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./db/client')
const path = require('node:path');
const indexRouter = require('./routes/indexRouter');
const uploadRouter = require('./routes/upload');
const passport = require('passport');
const authRouter = require('./routes/auth');
require("dotenv").config();



const app = express();


app.use(session({
    secret: process.env.FOO_COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
    store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
}));
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.set('views', './views');
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    if(req.user) {
        res.locals.currentUser = req.user;
    }
    const messages = req.session.messages || [];
    res.locals.messages = messages;
    res.locals.hasMessages = !!messages.length;
    req.session.messages = [];
    next();
})

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/folders', uploadRouter);




app.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next(error); 
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.status || 500;
    res.status(statusCode);
    return res.render('error', {statusCode: statusCode, error: error.message});
})

app.listen(3000, () => console.log("app listening on port 3000!"));





