const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const foldersRouter = require('./foldersRouter');
const authRouter = require('./auth');
const sharedFoldersRouter = require('./sharedFoldersRouter');
const filesRouter = require('./filesRouter');
const db = require('../db/queries');
const fn = require('../controllers/functions');

const indexRouter = Router();

indexRouter.use('/', authRouter);
indexRouter.use('/folders', foldersRouter);
indexRouter.use('/share', sharedFoldersRouter);
indexRouter.use('/files', filesRouter);

indexRouter.get('/', fn.checkAuth, asyncHandler(async(req, res) => {
    const folder = await db.getRootFolder(req.user.id);
    fn.formatData(folder);
    res.render('index', {title: 'Upload Files', folder: folder, chain: [folder]});
}));




module.exports = indexRouter;