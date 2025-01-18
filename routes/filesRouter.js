const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const multer  = require('multer');
const fn = require('../controllers/functions');
const controller = require('../controllers/fileController')


const filesRouter = Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


filesRouter.post('/upload', fn.checkAuth, upload.array('files'), asyncHandler(controller.uploadFile))

filesRouter.get('/edit/:id', fn.checkAuth, asyncHandler(controller.editForm))

filesRouter.post('/edit', fn.checkAuth, asyncHandler(controller.updateFile))

filesRouter.post('/delete', fn.checkAuth, asyncHandler(controller.deleteFile))



module.exports = filesRouter;