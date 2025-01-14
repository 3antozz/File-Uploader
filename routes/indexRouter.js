const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const db = require('../db/queries');

const indexRouter = Router();


indexRouter.get('/', asyncHandler((req, res) => {
    res.render('index', {title: 'Home'})
}));

module.exports = indexRouter;