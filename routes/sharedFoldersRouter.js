const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const fn = require('../controllers/functions');
const controller = require('../controllers/sharedFolderController')


const router = Router();


router.post('/', fn.checkAuth, asyncHandler(controller.shareFolder))

router.get('/:token', asyncHandler(controller.getSharedFolder))
router.get('/:token/folders/:folderId', asyncHandler(controller.getSharedSubFolder))
router.post('/stop', asyncHandler(controller.stopSharing))


module.exports = router;




