const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const fn = require('../controllers/functions');
const controller = require('../controllers/folderController')
// const {body, validationResult} = require('express-validator');

const uploadRouter = Router();



uploadRouter.post('/create', fn.checkAuth, asyncHandler(controller.createFolder))

uploadRouter.post('/delete', fn.checkAuth, asyncHandler(controller.deleteFolder))

uploadRouter.get('/edit/:id', fn.checkAuth, asyncHandler(controller.editForm))

uploadRouter.post('/edit', fn.checkAuth, asyncHandler(controller.updateFolder))

uploadRouter.get('/:id', fn.checkAuth, asyncHandler(controller.getFolder))



module.exports = uploadRouter;