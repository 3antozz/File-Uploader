const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const db = require('../db/queries');

const indexRouter = Router();

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}


indexRouter.get('/', checkAuth, asyncHandler(async(req, res) => {
    const folder = await db.getRootFolder(req.user.id);
    res.render('index', {title: 'Upload Files', folder: folder});
}));

indexRouter.get('/upload', checkAuth, asyncHandler((req, res) => {
    res.render('upload', {title: 'Upload Files'});
}));



module.exports = indexRouter;