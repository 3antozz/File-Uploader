const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const fn = require('../controllers/functions');
const controller = require('../controllers/folderController')
const { body } = require('express-validator');


const validateFolderName = [
    body("folder_name").trim().notEmpty().withMessage("Folder name must not be empty").bail().isLength({min: 1, max: 30}).withMessage("Folder name must be between 1 and 30 characters")
]

const uploadRouter = Router();



uploadRouter.post('/create', fn.checkAuth, validateFolderName, asyncHandler(controller.createFolder))

uploadRouter.post('/delete', fn.checkAuth, asyncHandler(controller.deleteFolder))

uploadRouter.get('/edit/:id', fn.checkAuth, asyncHandler(controller.editForm))

uploadRouter.post('/edit', fn.checkAuth, asyncHandler(controller.updateFolder))

uploadRouter.get('/:id', fn.checkAuth, asyncHandler(controller.getFolder))



module.exports = uploadRouter;