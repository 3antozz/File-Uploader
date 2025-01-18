const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const foldersRouter = require('./foldersRouter');
const authRouter = require('./auth');
const sharedFoldersRouter = require('./sharedFoldersRouter');
const filesRouter = require('./filesRouter');
const folderController = require('../controllers/folderController')
const fn = require('../controllers/functions');

const indexRouter = Router();

indexRouter.use('/', authRouter);
indexRouter.use('/folders', foldersRouter);
indexRouter.use('/share', sharedFoldersRouter);
indexRouter.use('/files', filesRouter);

indexRouter.get('/', fn.checkAuth, asyncHandler(folderController.getIndexFolder));




module.exports = indexRouter;